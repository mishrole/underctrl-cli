import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit, AfterViewInit , OnDestroy {

  userFormGroup!: FormGroup;
  today: Date;
  user: any;
  userId: any;

  constructor(
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dataService: DataService
  ) { }

  ngOnDestroy(): void {
    this.dataService.setOption('hideFab', false);
  }

  ngAfterViewInit(): void {
    // this.dataService.setOption('hideFab', true);
  }

  get frmUser(): any { return this.userFormGroup.controls; }

  createUserForm(): void {
    this.userFormGroup = this .formBuilder.group({
      Firstname: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')
      ])],
      Lastname: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')
      ])],
      Birthday: ['', Validators.compose([
        Validators.required
      ])],
      Email: [{value: '', disabled: true}, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
  }

  ngOnInit(): void {
    const session = this.authService.getSession();
    console.warn(session);
    this.userId = session?.user?.id;
    this.getUser();
    this.createUserForm();
    this.today = new Date();
    this.dataService.setOption('hideFab', true);
  }

  updateUser(): void {
    this.utilService.markFormTouched(this.userFormGroup);

    if (this.userFormGroup.valid) {
      const editUser = new User();
      editUser.firstname = this.frmUser.Firstname.value.trim();
      editUser.lastname = this.frmUser.Lastname.value.trim();
      editUser.birthday = this.frmUser.Birthday.value;
      editUser.email = this.user.email;

      this.utilService.confirmDialog('Are you sure you want to update your profile?').then((confirm: any) => {
        if (confirm) {
          this.spinner.show();

          this.userService.update(this.userId, editUser).subscribe(res => {

            const user = new User();
            const roles: Role[] = [];

            for (const item of res.data.roles) {
              const role = new Role();
              role.id = item.id;
              role.name = item.name;
              roles.push(role);
            }

            user.roles = roles;
            user.id = res.data.id;
            user.firstname = res.data.firstname || '';
            user.lastname = res.data.lastname || '';
            user.email = res.data.email || '';

            console.warn('res', res);
            const session = this.authService.getSession();

            if (session != null) {
              session.user = user;
              this.authService.saveSession(session);
            }

            this.dataService.setOption('profileUpdated', true);

            this.utilService.success('User updated');
            this.redirectToHome();
          },
            err => {
              this.spinner.hide();
              console.warn(err);
              this.utilService.errorHTML('', this.utilService.generateErrorMessage(err));
            }, () => this.spinner.hide()
          );
        }
      });
    }
  }

  private redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  getUser(): void {
    this.userService.findById(this.userId).subscribe(res => {
      console.warn(res);
      this.user = res.data;

      this.frmUser.Firstname.setValue(res.data.firstname);
      this.frmUser.Lastname.setValue(res.data.lastname);
      this.frmUser.Birthday.setValue(res.data.birthday);
      this.frmUser.Email.setValue(res.data.email);

      this.dataService.setOption('breadcrum', `Edit ${this.user.firstname}'s Profile`);
    },
      err => {
        this.spinner.hide();
        console.warn(err);
        this.utilService.errorHTML('', this.utilService.generateErrorMessage(err));
      }, () => this.spinner.hide()
    );
  }

}
