
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
  moduleId: module.id,
  selector: 'dropahead',
  templateUrl: 'dropahead.component.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  styleUrls: ['dropahead.component.css'],

})
export class DropaheadComponent implements OnInit ,ControlValueAccessor{

    @ViewChild('typeaheadInputElement') typeaheadInputElement;
    @ViewChild('suggestionDiv')suggestionDiv:ElementRef;
    //start search when the input is more than @input
    @Input()
    searchMinChar=1

    @Output()
    hasFocus=new EventEmitter();
    private _hasfocus:boolean;
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

        var splited = currentOption.split(" "); 
        var splitedQuery= query.value.split(" ")
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
            this.suggestionsVisiable=false;
             
         }
  
        }
}

keyHandler(event){

    
    switch (event.keyCode) {
        

        case 38: 
    //    Key : Up Arrow
    if(this.suggestionsVisiable){
        if(this.suggestionDiv.nativeElement.scrollTop>0) this.suggestionDiv.nativeElement.scrollTop -=38;

        if(this.highlightedOptionIndex <= this.suggestions.length &&  this.highlightedOptionIndex>=0){

        this.highlightedOptionIndex-=1
        this.highlightedOption=this.suggestions[this.highlightedOptionIndex];}
        //if there is no more options up then reset the index to 0
        if(this.highlightedOptionIndex==-1){
        this.suggestionDiv.nativeElement.scrollTop =this.suggestionDiv.nativeElement.scrollHeight;

            this.highlightedOptionIndex=this.suggestions.length-1
              this.highlightedOption=this.suggestions[this.highlightedOptionIndex];
              
        }
    }
         break;

        case 40:
        if(this.suggestionsVisiable){
        // Key : Down Arrow
            if(this.highlightedOptionIndex < this.suggestions.length){
            if(this.suggestionDiv.nativeElement.scrollTop<this.suggestionDiv.nativeElement.scrollHeight&&this.highlightedOption) this.suggestionDiv.nativeElement.scrollTop +=38;
            
      this.highlightedOptionIndex+=1;          
      this.highlightedOption=this.suggestions[this.highlightedOptionIndex];

      //if there is no more options down then reset the index to 0

        }
        if(this.highlightedOptionIndex ==this.suggestions.length){
            this.highlightedOptionIndex=0
            this.highlightedOption=this.suggestions[this.highlightedOptionIndex];
         this.suggestionDiv.nativeElement.scrollTop =0;


        }}
        else{
            this.dropdownHandler();
        }
            break;

        case 13 :
        event.preventDefault();
        // Key : Enter 

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
         if(this.typeaheadInputElement.nativeElement.value==""){
             this.dropdownHandler();
             break;
         }
        //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
         this.suggestions = [];
        break;

        case 9 :
        // Key : TAB 
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
        if(!this.suggestionsVisiable ){
    this.suggestions=this.options
    this.suggestionsVisiable = true;
    //dropdown need the field to be emtpy to get all the value otherwise it going to query for the available value 
    //setting the time out 500 so the event wont effect the field and auto select the first option
    setTimeout(_ =>
    this._renderer.invokeElementMethod(this.typeaheadInputElement.nativeElement,'focus',[]),500)
        }
    else {
    this.suggestionsVisiable=false;
    }
}

    onFocus(event:Event){
      this.onTouchedCallback("")
              this.hasFocus.emit(true)
              this._hasfocus=true;
        if(this.selectedOption){
            
//        this.selectedOption.length>=this.searchMinChar?this.suggestionsVisiable=true:this.suggestionsVisiable=false
}
        
      //  this.suggestionsVisiable=true
    }
    onBlur(event:Event){
        this.hasFocus.emit(false);
         this._hasfocus=false;
        var inputvalue =this.typeaheadInputElement.nativeElement.value
    
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
    onMouseOver(event:Event, option){
    //TODO : remove css that controll hover,
    
    this.highlightedOption=option
    this.highlightedOptionIndex=this.findOptionIndex(option);
    }
    private findOptionIndex(option): number{
for (var index = 0; index < this.options.length; index++) {
    if(option==this.options[index]){
        return index;
    }
    
}
    }
    isValidOption(value){        
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
