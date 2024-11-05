import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {TestService} from "../../../shared/services/test.service";
import {DefaultResponseType} from "../../../../types/defaul-response.type";
import {QuizQuestionType, TestFindType} from "../../../../types/quiz.type";
import {TestAnswerType} from "../../../../types/test-answer.type";

@Component({
    selector: 'app-answers',
    templateUrl: './answers.component.html',
    styleUrls: ['./answers.component.scss']
})
export class AnswersComponent implements OnInit {
    testId: number | string = ''
    userInfo: UserInfoType | null = null
    userEmail: string | null = null
    quiz: TestFindType | null = null
    quizAnswerRight: TestAnswerType | null = null
    chosenAnswer: number | string = ''

    constructor(private router: Router,
                private authService: AuthService,
                private testService: TestService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.userInfo = this.authService.getUserInfo()
        this.userEmail = this.authService.getEmail()

        this.activatedRoute.params.subscribe(params => {
            if (params['id']) {
                this.testId = params['id']
                if (this.userInfo) {
                    this.testService.getAnswers(this.testId, this.userInfo.userId).subscribe(result => {
                        if ((result as DefaultResponseType).error !== undefined) {
                            throw new Error((result as DefaultResponseType).message)
                        }
                        this.quiz = result as TestFindType
                    })

                    this.testService.getAnswerRight(this.testId, this.userInfo.userId).subscribe(result => {
                        if ((result as DefaultResponseType).error !== undefined) {
                            throw new Error((result as DefaultResponseType).message)
                        }
                        this.quizAnswerRight = result as TestAnswerType

                    })

                }
            }
        })


    }

    showResult(id: number | string) {
        this.testId = id;
        this.router.navigate(['/result'], {queryParams: {id: this.testId}})
    }
}
