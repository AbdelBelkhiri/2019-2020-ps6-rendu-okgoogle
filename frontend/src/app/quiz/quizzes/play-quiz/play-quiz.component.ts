import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { Quiz } from 'src/models/quiz.model';
import { QuizService } from 'src/services/quiz.service';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from 'src/services/result.service';
import { Question } from 'src/models/question.model';
import { Theme } from 'src/models/theme.model';
import { Answer } from 'src/models/answer.model';
import { ThemeService } from 'src/services/theme.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-play-quiz',
    templateUrl: './play-quiz.component.html',
    styleUrls: ['./play-quiz.component.scss'],
  })

  export class PlayQuizComponent implements OnInit {

    public quiz: Quiz;
    public curTheme: Theme;
    public questionSelected: Question;
    public ptrQuestion: number = 0;
    public quizFini = false;
    public timerPopup = 5;
    public sonUrlQuestionActuelle = "";
    public playSong : boolean = false;
    public afficheIndice : boolean = false;
    public quizDebut: boolean;
    public menu : boolean = false;
    public replay: boolean = false;
    questionPrec: boolean;
    modalIn: boolean = false;
    modalOut: boolean = false;

    @ViewChild('progressBar', {read:ElementRef,static:false}) progressBar:ElementRef;

    constructor(private renderer: Renderer2,private _location: Location,private route: ActivatedRoute,public quizService: QuizService,public themeService: ThemeService,private resService: ResultService) {      

    }
    
    ngOnInit() {    
      const themeid = this.route.snapshot.paramMap.get('themeid');
      const quizid = this.route.snapshot.paramMap.get('quizid');
      this.themeService.setSelectedTheme(themeid.toString())
      this.themeService.themeSelected$.subscribe((theme)=>this.curTheme = theme)
      this.resService.setSelectedQuiz(quizid.toString(),themeid.toString());
      this.resService.quizSelected$.subscribe((quiz) => {
        this.quiz = quiz
        this.resService.questionSelected$.subscribe((question) =>{
          this.questionSelected = question
          this.sonUrlQuestionActuelle = "src/assets/sons/"+this.questionSelected.sonUrl
        })
      });
    }
    
    selectAnswer(answer: Answer){

      var divIndice = document.querySelector("#indice")
      if(divIndice.textContent != "")
        divIndice.innerHTML="";

      //quiz pas fini
      if( answer.isCorrect && this.ptrQuestion != this.quiz.questions.length-1){
        this.modalIn = true;
        this.modalOut = false;
        this.quizDebut = false;
        const progressBar = this.progressBar.nativeElement;
        progressBar.children[this.ptrQuestion].classList.add("completed")  
        this.ptrQuestion++;
        progressBar.children[this.ptrQuestion].classList.add("active")  
        this.afficheIndice = false;
        this.playSong = false;
        this.sonUrlQuestionActuelle = "src/assets/sons/"+this.questionSelected.sonUrl;
        var interval = setInterval(()=> {
            this.timerPopup--;
            if (this.timerPopup == 0){
              clearInterval(interval);
              return;
            }
        }, 1000);

        document.body.classList.add('modal-active')
        setTimeout(()=>{
          this.modalOut = true;
          document.body.classList.remove('modal-active')
        },5000)
        this.timerPopup = 5;
      }
      //quiz fini
      else if(this.questionSelected.id === this.quiz.questions[this.quiz.questions.length-1].id && answer.isCorrect === true){
        this.quizDebut = false;
        this.afficheIndice = false;
        this.playSong = false;
        this.modalOut = false;
        this.quizFini = true;
        this.modalIn = true;
        document.body.classList.add('modal-active')
      }
      
      this.resService.setSelectedAnswer(this.questionSelected.id.toString(),answer.id.toString())
    }

    aide(){
      if(this.questionSelected.indice != ""){
        this.afficheIndice = true
      }else{
        this.playSong = true;
        console.log(this.playSong)
      }
      this.resService.GiveClues()
    }

    questionPrecedente(){
      if(this.ptrQuestion > 0){
        this.playSong = false;
        this.afficheIndice = false;
        this.resService.previousQuestion()
        this.ptrQuestion--;
        const progressBar = this.progressBar.nativeElement;
        progressBar.children[this.ptrQuestion].classList.add("active")
        progressBar.children[this.ptrQuestion].classList.remove("completed")
        progressBar.children[this.ptrQuestion+1].classList.remove("active")
      }
    }

    changeFont(event){
      var pInSpan = document.querySelectorAll(".zommableEnonce")

      for (var i in pInSpan ) {
          pInSpan[i].setAttribute("style", "font-size:"+event.target.value+"px;");
      }
    }

    // resetTaille(){
    //   var pInSpan = document.querySelectorAll(".zommableEnonce")

    //   for (var i in pInSpan) {
    //     if(parseInt(i) >= 2)
    //      pInSpan[i].setAttribute("style", "font-size: 16px;");
    //     else
    //       pInSpan[i].setAttribute("style", "font-size: 25px;");

    //   }

    //   var range = document.querySelector("#rangeTaille")
    //   range.setAttribute("value", "20")
    // }

    changeContrastToBlack(){
      var mainContent = document.querySelector("html")
      mainContent.classList.add("contrast-black");
      mainContent.classList.remove("contrast-white");
    }

    changeContrastToWhite(){
      var mainContent = document.querySelector("html")
      mainContent.classList.add("contrast-white");
      mainContent.classList.remove("contrast-black");
    }

    rejouer(){
      this.quizDebut = true;
      this.quizFini = false;
      this.replay = true;
      var interval = setInterval(()=> {
          this.timerPopup--;
          if (this.timerPopup == 0){
            clearInterval(interval);
            return;
          }
      }, 1000);
      document.body.classList.add('modal-active')
      setTimeout(()=>{
        this.modalOut = true; 
        this.ptrQuestion = 0;
        const themeid = this.route.snapshot.paramMap.get('themeid');
        const quizid = this.route.snapshot.paramMap.get('quizid');
        this.themeService.setSelectedTheme(themeid.toString())
        this.themeService.themeSelected$.subscribe((theme)=>this.curTheme = theme)
        this.resService.setSelectedQuiz(quizid.toString(),themeid.toString());
        this.resService.quizSelected$.subscribe((quiz) => {
          this.quiz = quiz
          this.resService.questionSelected$.subscribe((question) =>{
            this.questionSelected = question
            this.sonUrlQuestionActuelle = "src/assets/sons/"+this.questionSelected.sonUrl
          })
        });
        document.body.classList.remove('modal-active')
      },5000)
      this.timerPopup = 5;
    }

    quitter(){
      this.modalOut = true;
      this.goBack();
    }

    switchMenu(){
      if(this.menu == false){
        this.menu = true;
      }else{
        this.menu = false;
      }
    }

    goBack(){
      this._location.back();
    }
}