import {Component, OnInit} from '@angular/core';
import {TestService} from "../../../shared/services/test.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/defaul-response.type";
import {PassTestResponseType} from "../../../../types/pass-test-response.type";

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    result: string = ''
    testId: number | string = ''

    constructor(private testService: TestService,
                private _snackBar: MatSnackBar,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['id']) {
                this.testId = params['id']
                const userInfo: UserInfoType | null = this.authService.getUserInfo()
                if (userInfo) {
                    this.testService.getResult(this.testId, userInfo.userId).subscribe(result => {
                        if (result) {
                            if ((result as DefaultResponseType).error !== undefined) {
                                throw new Error((result as DefaultResponseType).message)
                            }

                            this.result = (result as PassTestResponseType).score +
                                '/' + (result as PassTestResponseType).total

                        }
                    });
                }

            }

        });
    }

    showAnswers(id: number | string){
        this.router.navigate(['/answers', id])
    }

}
