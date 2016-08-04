
import { Component, Provider, forwardRef, Input, Output, 
    EventEmitter, OnInit,ElementRef,Inject,AfterContentInit,HostListener,AfterViewChecked,HostBinding,
    ViewChild,Renderer} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from "@angular/common";

const noop = () => {};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => DropaheadComponent),
    multi: true
  });


@Component({

  selector: 'dropahead',
  template:` <div  class="dropaheadcontainer" *ngIf="options">
  <form class="dropahead-form" >
    <!--if the option are array of string the first input will appear
    the (input) passing flag for if the options are object
     -->
     <div class="input-group">
   <input *ngIf="!fieldName" #typeaheadInputElement (keydown)="keyHandler($event)" (input)="inputChangehandler($event,false)"  class="form-control"  type="text" (focus)="onFocus($event)" (blur)="onBlur($event)" [(ngModel)]="selectedOption"  > 
    <input *ngIf="fieldName" #typeaheadInputElement (keydown)="keyHandler($event)" (input)="inputChangehandler($event,true)"  class="form-control"  type="text" (focus)="onFocus($event)" (blur)="onBlur($event)" [ngModel]="getSelectedOption()"  >
   <span class="input-group-addon" id="basic-addon2" (click)="dropdownHandler()"><button class="clean">↓</button></span>
     </div>
   <ul *ngIf="suggestionsVisiable" class="suggestions" #suggestionDiv >
 <span *ngIf="fieldName" >   <li  *ngFor="let option of suggestions" class="list-group-item" [class.active]="option == highlightedOption" 
      (click)="optionClickHandler(option)" (mouseenter)="onMouseOver($event,option)">{{ option[fieldName] }}</li>
</span>
  <span *ngIf="!fieldName" > 
     <li *ngFor="let option of suggestions" class="list-group-item" [class.active]="option == highlightedOption" 
      (click)="optionClickHandler(option)" (mouseenter)="onMouseOver($event,option)">{{option}}</li>
     
  </span>
  </ul>
    </form>
  </div>
`,
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  styles: [` 
    .dropaheadcontainer{
      width: 160px;
     float: left;
 
    
    }
    
    input.dropaheadsearch {
      position: relative;
      z-index: 2;
      width: 150px;
      font-size: 12px;
      
    }
       .dropaheadDropdownButton {

    height: 12px;
    position: relative; 
    width: 12px;
    z-index: 3;
	background-color:#00bfff;
	-moz-border-radius:4px;
	-webkit-border-radius:4px;
	border-radius:4px;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:12px;
	text-decoration:none;



    }
    .dropaheadDropdownButton:hover {

	background-color:#019ad2;
    }
    .dropaheadDropdownButton:active {
	top:1px;
}

  

    .suggestions {
  height: auto;
    max-height: 200px;
    overflow-x: hidden;
      padding: 0;
      position: relative;
      transition: ease-in;
      box-shadow: 0 2px 1px 0 #dcdcdc,0 -2px 1px 0 #dcdcdc;;
  overflow: scroll; 
    -webkit-animation: fadein .5s; 
            animation: fadein .5s;
    }
    
    .suggestionsoption {
      background: white;
      border-bottom: 1px solid #D8D8D8;
      padding: 10px;
      transition: background 0.2s;
      display: flex;
       
      
      text-transform: capitalize;
    }
  /*.suggestionsoption:hover {
      background: gray;
     
  }*/
     .suggestionselected {
      background: gray;
     
  }
 
  
    
    span.population {
      font-size: 12px;
    }
    
    .details {
      text-align: center;
      font-size: 10px;
    }
    
    .hl {
      background: #ffc600;
    }
    
    .love {
      text-align: center;
      line-height: 2;
    }
    
    a {
      color: black;
      background: rgba(0, 0, 0, 0.1);
      text-decoration: none;
    }
    .dropaheadDropdownButton {
    height: 25px;
    width: 25px;
    }


@keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}

button.clean {

    background: transparent;
    border: none ;
    font-size:12px;

}`],

})
export class DropaheadComponent implements OnInit ,ControlValueAccessor{

    @ViewChild('typeaheadInputElement') typeaheadInputElement;
    @ViewChild('suggestionDiv')suggestionDiv:ElementRef;
    //start search when the input is more than @input
    @Input()
    searchMinChar=1

    @Output()
    hasFocus=new EventEmitter();

    //the fieldname to display when you are passing the Option as Array of Object 'not string'
    @Input()
    fieldName

    //initialize value for the field 
    @Input()
    initValue;

    //array of options
    @Input()
    options;

    //array of filtered options
    suggestions=[];

    //the selected value ngModel Output()
    //TODO : Event Emmiter

    selectedOption;

    //this get highlight on click and arrow click
    highlightedOption;
    highlightedOptionIndex=-1

    


 
    //control the visibility for the suggestions
    suggestionsVisiable:boolean;

    

    //The internal data model
    private _value: any = '';
 	onTouchedCallback: (_:any) => void = noop ;
    onChangeCallback: (_:any) => void = noop ;
    writeValue(value: any) {
        this.selectedOption=value
    }

    registerOnChange(fn: any) {
      this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
      this.onTouchedCallback = fn;
    }
    set value(value){
        this.selectedOption=value
    }
    get value(){
        return this.selectedOption;
    }
  

    ngOnInit() { 
        //getting setting the value on the field on init
        if(this.initValue){
        this.selectedOption=this.initValue}
    }
    constructor(private _eref: ElementRef ,private _renderer:Renderer) {
    }


    logger(any) { console.log(any) }
   
  

    search(query,isObject?:boolean) {
this.highlightedOption=null;
    //this is to remove any character may break the regex, Accept only letters and numbers..
      query.value = query.value.replace(/[^\/\w\s]/g,'');
        this.suggestions = [];
        query.value.length>=this.searchMinChar?this.suggestionsVisiable=true:this.suggestionsVisiable=false
        let regPattern = new RegExp( "^" +query.value ,"i");
        if(query.value!=""){ 
           
        for (var i = 0; i < this.options.length; i++) {
             var currentOption = this.options[i];

        if(isObject){
            
       currentOption= currentOption[this.fieldName];
   	    }
       console.log("the current Option : "+currentOption);

        var splited = currentOption.split(" "); 
        var splitedQuery= query.value.split(" ")
        console.log(JSON.stringify(splited));
         if(currentOption == query.value ){
             this.suggestions.push(this.options[i])
         }
          
     else if (regPattern.test(currentOption.toLowerCase())){
             this.suggestions.push(this.options[i]);
         }
         // TODO : put && and make input value that control this option
         else if (splited.length>1){
             for (var index = 0; index < splited.length; index++) {
                 var word = splited[index];
              
                
                 
               regPattern.test(word)?this.suggestions.push(this.options[i]):null
                console.log("testing " + word+" ..." +regPattern.test(word)); 
             }
       
         }
   }

         //highlighting the first value *if the is any
         if(this.suggestions.length>=1){
             this.highlightedOptionIndex=0;
             this.highlightedOption=this.suggestions[0];
             
         }
            if(this.suggestions.length==0){
           
            this.highlightedOption=null;
             
         }
  
        }
}

logHeight(){
   console.log("scroll height : "+this.suggestionDiv.nativeElement.scrollHeight)
   console.log("scroll Calculated"+ (this.suggestions.length)*39);
   
}

keyHandler(event){
console.log(event.keyCode);
    
    switch (event.keyCode) {
        

        case 38: 
        console.log("Key : Up Arrow");
        if(this.suggestionDiv.nativeElement.scrollTop>0) this.suggestionDiv.nativeElement.scrollTop -=39;

        if(this.highlightedOptionIndex <= this.suggestions.length &&  this.highlightedOptionIndex>=0){
        console.log("scroll " +this.suggestionDiv.nativeElement.scrollTop);

        this.highlightedOptionIndex-=1
        this.highlightedOption=this.suggestions[this.highlightedOptionIndex];}
        //if there is no more options up then reset the index to 0
        if(this.highlightedOptionIndex==-1){
        this.suggestionDiv.nativeElement.scrollTop =this.suggestionDiv.nativeElement.scrollHeight;

            this.highlightedOptionIndex=this.suggestions.length-1
              this.highlightedOption=this.suggestions[this.highlightedOptionIndex];
              
        }

         break;

        case 40:
         console.log("Key : Down Arrow");
            if(this.highlightedOptionIndex < this.suggestions.length){
            if(this.suggestionDiv.nativeElement.scrollTop<this.suggestionDiv.nativeElement.scrollHeight) this.suggestionDiv.nativeElement.scrollTop +=39;
            console.log("scroll " +this.suggestionDiv.nativeElement.scrollTop);
            
      this.highlightedOptionIndex+=1;          
      this.highlightedOption=this.suggestions[this.highlightedOptionIndex];

      //if there is no more options down then reset the index to 0

        }
        if(this.highlightedOptionIndex ==this.suggestions.length){
            this.highlightedOptionIndex=0
            this.highlightedOption=this.suggestions[this.highlightedOptionIndex];
         this.suggestionDiv.nativeElement.scrollTop =0;


        }
            break;

        case 13 :
        event.preventDefault();
         console.log("Key : Enter ");
         console.log( this.suggestions );
         console.log(this.suggestionsVisiable);
         
         
         if( this.highlightedOption && this.fieldName){
          //fix for selecting the field twice it for the same value it wont reflect it in the input element    
          this.typeaheadInputElement.nativeElement.value=this.highlightedOption[this.fieldName]

         }
         if(this.suggestionsVisiable){
        this.selectedOption = this.highlightedOption
         }
        this.onChangeCallback(this.selectedOption)
        if(this.suggestionsVisiable){
            this.suggestionsVisiable=false;
        }
        
        //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
         this.suggestions = [];
        break;

        case 9 :
         console.log("Key : TAB ");
         console.log( this.suggestions );
         console.log(this.suggestionsVisiable);
         
         
         if( this.highlightedOption && this.fieldName){
          //fix for selecting the field twice it for the same value it wont reflect it in the input element    
          this.typeaheadInputElement.nativeElement.value=this.highlightedOption[this.fieldName]
         }
         if(this.suggestionsVisiable){
        this.selectedOption = this.highlightedOption
         }
        this.onChangeCallback(this.selectedOption)
        if(this.suggestionsVisiable){
            this.suggestionsVisiable=false;
        }
        //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
         this.suggestions = [];
        break;
    
        default:
            break;

    }
}
  optionClickHandler(option:any){

        
    this.highlightedOption = option;
    this.selectedOption = option
       if(  this.selectedOption == this.highlightedOption && this.fieldName){
          //fix for selecting the field twice it for the same value it wont reflect it in the input element    
          this.typeaheadInputElement.nativeElement.value=this.selectedOption[this.fieldName]
         }
    this.onChangeCallback(option)
    //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
    this.suggestions = [];
    this.suggestionsVisiable=false;
    }
    inputChangehandler(event,isObject?:boolean){
        this.highlightedOptionIndex=-1;
        
        this.search(event.target,isObject)
        
        
    }
    dropdownHandler(){
    this.suggestions=this.options
    this.suggestionsVisiable = true;
    //dropdown need the field to be emtpy to get all the value otherwise it going to query for the available value 
    //setting the time out 500 so the event wont effect the field and auto select the first option
    setTimeout(_ =>
    this._renderer.invokeElementMethod(this.typeaheadInputElement.nativeElement,'focus',[]),500)
    
}

    onFocus(event:Event){
      this.onTouchedCallback("")
              this.hasFocus.emit(true)
        if(this.selectedOption){
            
//        this.selectedOption.length>=this.searchMinChar?this.suggestionsVisiable=true:this.suggestionsVisiable=false
}
        
      //  this.suggestionsVisiable=true
    }
    onBlur(event:Event){
        this.hasFocus.emit(false)
        var inputvalue =this.typeaheadInputElement.nativeElement.value
    console.log("option Is Valid ? "+this.isValidOption(inputvalue));
    
    if(!this.isValidOption(inputvalue)){
    this.typeaheadInputElement.nativeElement.value="" ;
        this.onChangeCallback(null)

    this.selectedOption=null   }
           
    }

    @HostListener('document:click', ['$event'])
    onDOMClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) {
    this.suggestionsVisiable=false;
    }
    
    }
    onMouseOver(event:Event, option:number){
    //TODO : remove css that controll hover,
   
    this.highlightedOption=option
   
    }

    isValidOption(value){
        console.log("isValid passed value "+value);
        
        var option = value;
      
        for (var index = 0; index < this.options.length; index++) {
        if(this.fieldName){
            if(value== this.options[index][this.fieldName]){
             return true;}
        }
        else{
             if(value== this.options[index]){
             return true;}
        }
        }
        return false;
    }

    getSelectedOption(){
      
           return this.selectedOption ? this.selectedOption[this.fieldName]:"";
      
    }
    setSelectedOption(option){
this.fieldName ? this.selectedOption=option[this.fieldName] : this.selectedOption = option;
    }

    }
