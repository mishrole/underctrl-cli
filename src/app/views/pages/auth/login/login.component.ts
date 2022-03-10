import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/core/constants';
import { LoginRequest } from 'src/app/models/request/login.request';
import { Role } from 'src/app/models/role';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  saveSession = false;
  savedSession: Session | undefined;

  loginFormGroup!: FormGroup;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    private formBuilder: FormBuilder,
  ) {
    this.savedSession = this.authService.getSession();

    if (this.savedSession?.authenticated) {
      this.redirectToHome();
    }
  }

  get frmLogin(): any { return this.loginFormGroup.controls; }

  createLoginForm(): void {
    this.loginFormGroup = this.formBuilder.group({
      Email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      Password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(128)
      ])]
    });
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  authenticate(): void {
    // console.info('this.loginFormGroup.value', this.loginFormGroup.value);
    // console.info('this.loginFormGroup', this.loginFormGroup);
    // console.info('this.frmLogin', this.frmLogin);

    this.utilService.markFormTouched(this.loginFormGroup);

    if (this.loginFormGroup.valid) {
      this.spinner.show();

      const loginRequest = new LoginRequest(
        this.frmLogin.Email.value.trim(),
        this.frmLogin.Password.value,
        Constants.GRANT_TYPE_TOKEN
      );

        this.authService.oauth(loginRequest).subscribe(res => {

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

          // this.utilService.success("Success! You logged in");
        }, err => {
          this.spinner.hide();
          console.warn(err);
          this.utilService.error("", err?.error.error_description);
        }, () => {
          this.spinner.hide(); 
          }
        );
    } else {
      this.utilService.warn("Please review the information entered");
    }

  }

  private redirectToHome(): void {
    this.router.navigate(['/home']);
  }

  // private markFormTouched(group: FormGroup | FormArray) {
  //   const controls: any = group.controls;
  //   Object.keys(controls).forEach((key: string) => {
  //     const control = controls[key];
  //     if (control instanceof FormGroup || control instanceof FormArray) { control.markAsTouched(); this.markFormTouched(control); }
  //     else { control.markAsTouched(); };
  //   });
  // };

}
