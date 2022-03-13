import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap } from 'rxjs/operators';
import { Constants } from 'src/app/core/constants';
import { LoginRequest } from 'src/app/models/request/login.request';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;
  today: Date;

  constructor(
    private router: Router,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
  ) { }

  get frmRegister(): any { return this.registerFormGroup.controls; }

  createRegisterForm(): void {
    this.registerFormGroup = this.formBuilder.group({
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
      Email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      Password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ])],
      Confirm: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ])]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.createRegisterForm();
    this.today = new Date();
  }

  register(): void {
    this.utilService.markFormTouched(this.registerFormGroup);

    if (this.registerFormGroup.valid) {
      const user = new User();
      user.firstname = this.frmRegister.Firstname.value.trim();
      user.lastname = this.frmRegister.Lastname.value.trim();
      user.birthday = this.frmRegister.Birthday.value;
      user.email = this.frmRegister.Email.value.trim();
      user.password = this.frmRegister.Password.value;
      user.confirm = this.frmRegister.Confirm.value;

      this.spinner.show();

      this.userService.register(user).pipe(
        concatMap(() => this.authService.oauth(new LoginRequest(user.email, user.password, Constants.GRANT_TYPE_TOKEN)))
      ).subscribe(res => {
        console.log('res', res);

        const sessionUser = new User();

        const roles: Role[] = [];

        for (const item of res?.roles) {
          const role = new Role();
          role.id = item.id;
          role.name = item.name;
          roles.push(role);
        }

        sessionUser.roles = roles;

        sessionUser.id = res?.id;
        sessionUser.firstname = res?.firstname || '';
        sessionUser.lastname = res?.lastname || '';
        sessionUser.email = res?.email || '';

        const session = new Session(res?.access_token, res?.refresh_token, sessionUser);
        this.authService.saveSession(session);
        console.warn('saved session', session);
        this.redirectToHome();

      },
        err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.errorHTML('', this.utilService.generateErrorMessage(err));
        }, () => this.spinner.hide()
      );

      console.log(user);
    } else {
      this.utilService.warn('Please review the information entered');
    }
  }

  private redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  checkPasswords(group: FormGroup): void | null {
    const password = group.controls.Password.value;
    const confirm = group.controls.Confirm.value;

    if (password !== confirm) {
      return group.get('Confirm')?.setErrors({ notSame: true});
    }

    return null;
  }

}
