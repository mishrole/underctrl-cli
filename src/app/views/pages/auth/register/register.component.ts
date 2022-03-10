import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Session } from 'src/app/models/session';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatMap, mergeMap } from 'rxjs/operators';
import { Constants } from 'src/app/core/constants';
import { LoginRequest } from 'src/app/models/request/login.request';
import { LoginResponse } from 'src/app/models/response/login.response';
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
    this.today = new Date;
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
        console.info('res', res);

        const user = new User();

        const roles : Role[] = [];
        
        for (let item of res?.roles) {
          const role = new Role();
          role.id = item.id;
          role.name = item.name;
          roles.push(role);
        }
        
        user.roles = roles;

        user.id = res?.id;
        user.firstname = res?.firstname ||'';
        user.lastname = res?.lastname || '';
        user.email = res?.email || '';

        const session = new Session(res?.access_token, res?.refresh_token, user);
        this.authService.saveSession(session);
        console.warn('saved session', session);
        this.redirectToHome();

      },
        err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.error("", err?.error?.error_description);
        }, () => this.spinner.hide()
      );

      console.log(user);
    } else {
      this.utilService.warn("Please review the information entered");
    }
  }

  private redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  checkPasswords(group: FormGroup) {
    const password = group.controls.Password.value;
    const confirm = group.controls.Confirm.value;

    if (password !== confirm) {
      return group.get('Confirm')?.setErrors({ notSame: true});
    }

    return null;
  }

}
