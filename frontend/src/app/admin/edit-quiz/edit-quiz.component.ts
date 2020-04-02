import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Quiz } from 'src/models/quiz.model';
import { QuizService } from 'src/services/quiz.service';
import { Theme } from 'src/models/theme.model';
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-edit-quiz',
  templateUrl: './edit-quiz.component.html',
  styleUrls: ['./edit-quiz.component.scss']
})
export class editQuizComponent implements OnInit {

  public quiz: Quiz;
  public curTheme: Theme

  constructor(private route: ActivatedRoute, private quizService: QuizService, private themeService: ThemeService) { 
    const quizid = this.route.snapshot.paramMap.get('quizid');
    const themeid = this.route.snapshot.paramMap.get('themeid');
    this.themeService.setSelectedTheme(themeid.toString())
    this.themeService.themeSelected$.subscribe((theme)=> {
      this.curTheme = theme
      this.quizService.setSelectedQuiz(quizid.toString(),themeid.toString());
      this.quizService.quizSelected$.subscribe((quiz) => this.quiz = quiz);
    })
  }
  
  ngOnInit() {
    const quizid = this.route.snapshot.paramMap.get('quizid');
    const themeid = this.route.snapshot.paramMap.get('themeid');
    this.themeService.setSelectedTheme(themeid.toString())
    this.themeService.themeSelected$.subscribe((theme)=> {
      this.curTheme = theme
      this.quizService.setSelectedQuiz(quizid.toString(),themeid.toString());
      this.quizService.quizSelected$.subscribe((quiz) => this.quiz = quiz);
    })
  }

}