"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var common_1 = require("@angular/common");
var noop = function () { };
var CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new core_1.Provider(common_1.NG_VALUE_ACCESSOR, {
    useExisting: core_1.forwardRef(function () { return DropaheadComponent; }),
    multi: true
});
var DropaheadComponent = (function () {
    function DropaheadComponent(_eref, _renderer) {
        this._eref = _eref;
        this._renderer = _renderer;
        //start search when the input is more than @input
        this.searchMinChar = 1;
        this.hasFocus = new core_1.EventEmitter();
        //array of filtered options
        this.suggestions = [];
        this.highlightedOptionIndex = -1;
        //The internal data model
        this._value = '';
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
    }
    DropaheadComponent.prototype.writeValue = function (value) {
        this.selectedOption = value;
    };
    DropaheadComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    DropaheadComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    Object.defineProperty(DropaheadComponent.prototype, "value", {
        get: function () {
            return this.selectedOption;
        },
        set: function (value) {
            this.selectedOption = value;
        },
        enumerable: true,
        configurable: true
    });
    DropaheadComponent.prototype.ngOnInit = function () {
        //getting setting the value on the field on init
        if (this.initValue) {
            this.selectedOption = this.initValue;
        }
    };
    DropaheadComponent.prototype.logger = function (any) { console.log(any); };
    DropaheadComponent.prototype.search = function (query, isObject) {
        this.highlightedOption = null;
        //this is to remove any character may break the regex, Accept only letters and numbers..
        query.value = query.value.replace(/[^\/\w\s]/g, '');
        this.suggestions = [];
        query.value.length >= this.searchMinChar ? this.suggestionsVisiable = true : this.suggestionsVisiable = false;
        var regPattern = new RegExp("^" + query.value, "i");
        if (query.value != "") {
            for (var i = 0; i < this.options.length; i++) {
                var currentOption = this.options[i];
                if (isObject) {
                    currentOption = currentOption[this.fieldName];
                }
                console.log("the current Option : " + currentOption);
                var splited = currentOption.split(" ");
                var splitedQuery = query.value.split(" ");
                console.log(JSON.stringify(splited));
                if (currentOption == query.value) {
                    this.suggestions.push(this.options[i]);
                }
                else if (regPattern.test(currentOption.toLowerCase())) {
                    this.suggestions.push(this.options[i]);
                }
                else if (splited.length > 1) {
                    for (var index = 0; index < splited.length; index++) {
                        var word = splited[index];
                        regPattern.test(word) ? this.suggestions.push(this.options[i]) : null;
                        console.log("testing " + word + " ..." + regPattern.test(word));
                    }
                }
            }
            //highlighting the first value *if the is any
            if (this.suggestions.length >= 1) {
                this.highlightedOptionIndex = 0;
                this.highlightedOption = this.suggestions[0];
            }
            if (this.suggestions.length == 0) {
                this.highlightedOption = null;
            }
        }
    };
    DropaheadComponent.prototype.logHeight = function () {
        console.log("scroll height : " + this.suggestionDiv.nativeElement.scrollHeight);
        console.log("scroll Calculated" + (this.suggestions.length) * 39);
    };
    DropaheadComponent.prototype.keyHandler = function (event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 38:
                console.log("Key : Up Arrow");
                if (this.suggestionDiv.nativeElement.scrollTop > 0)
                    this.suggestionDiv.nativeElement.scrollTop -= 39;
                if (this.highlightedOptionIndex <= this.suggestions.length && this.highlightedOptionIndex >= 0) {
                    console.log("scroll " + this.suggestionDiv.nativeElement.scrollTop);
                    this.highlightedOptionIndex -= 1;
                    this.highlightedOption = this.suggestions[this.highlightedOptionIndex];
                }
                //if there is no more options up then reset the index to 0
                if (this.highlightedOptionIndex == -1) {
                    this.suggestionDiv.nativeElement.scrollTop = this.suggestionDiv.nativeElement.scrollHeight;
                    this.highlightedOptionIndex = this.suggestions.length - 1;
                    this.highlightedOption = this.suggestions[this.highlightedOptionIndex];
                }
                break;
            case 40:
                console.log("Key : Down Arrow");
                if (this.highlightedOptionIndex < this.suggestions.length) {
                    if (this.suggestionDiv.nativeElement.scrollTop < this.suggestionDiv.nativeElement.scrollHeight)
                        this.suggestionDiv.nativeElement.scrollTop += 39;
                    console.log("scroll " + this.suggestionDiv.nativeElement.scrollTop);
                    this.highlightedOptionIndex += 1;
                    this.highlightedOption = this.suggestions[this.highlightedOptionIndex];
                }
                if (this.highlightedOptionIndex == this.suggestions.length) {
                    this.highlightedOptionIndex = 0;
                    this.highlightedOption = this.suggestions[this.highlightedOptionIndex];
                    this.suggestionDiv.nativeElement.scrollTop = 0;
                }
                break;
            case 13:
                event.preventDefault();
                console.log("Key : Enter ");
                console.log(this.suggestions);
                console.log(this.suggestionsVisiable);
                if (this.highlightedOption && this.fieldName) {
                    //fix for selecting the field twice it for the same value it wont reflect it in the input element    
                    this.typeaheadInputElement.nativeElement.value = this.highlightedOption[this.fieldName];
                }
                if (this.suggestionsVisiable) {
                    this.selectedOption = this.highlightedOption;
                }
                this.onChangeCallback(this.selectedOption);
                if (this.suggestionsVisiable) {
                    this.suggestionsVisiable = false;
                }
                //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
                this.suggestions = [];
                break;
            case 9:
                console.log("Key : TAB ");
                console.log(this.suggestions);
                console.log(this.suggestionsVisiable);
                if (this.highlightedOption && this.fieldName) {
                    //fix for selecting the field twice it for the same value it wont reflect it in the input element    
                    this.typeaheadInputElement.nativeElement.value = this.highlightedOption[this.fieldName];
                }
                if (this.suggestionsVisiable) {
                    this.selectedOption = this.highlightedOption;
                }
                this.onChangeCallback(this.selectedOption);
                if (this.suggestionsVisiable) {
                    this.suggestionsVisiable = false;
                }
                //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
                this.suggestions = [];
                break;
            default:
                break;
        }
    };
    DropaheadComponent.prototype.optionClickHandler = function (option) {
        this.highlightedOption = option;
        this.selectedOption = option;
        if (this.selectedOption == this.highlightedOption && this.fieldName) {
            //fix for selecting the field twice it for the same value it wont reflect it in the input element    
            this.typeaheadInputElement.nativeElement.value = this.selectedOption[this.fieldName];
        }
        this.onChangeCallback(option);
        //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
        this.suggestions = [];
        this.suggestionsVisiable = false;
    };
    DropaheadComponent.prototype.inputChangehandler = function (event, isObject) {
        this.highlightedOptionIndex = -1;
        this.search(event.target, isObject);
    };
    DropaheadComponent.prototype.dropdownHandler = function () {
        var _this = this;
        this.suggestions = this.options;
        this.suggestionsVisiable = true;
        //dropdown need the field to be emtpy to get all the value otherwise it going to query for the available value 
        //setting the time out 500 so the event wont effect the field and auto select the first option
        setTimeout(function (_) {
            return _this._renderer.invokeElementMethod(_this.typeaheadInputElement.nativeElement, 'focus', []);
        }, 500);
    };
    DropaheadComponent.prototype.onFocus = function (event) {
        this.onTouchedCallback("");
        this.hasFocus.emit(true);
        if (this.selectedOption) {
        }
        //  this.suggestionsVisiable=true
    };
    DropaheadComponent.prototype.onBlur = function (event) {
        this.hasFocus.emit(false);
        var inputvalue = this.typeaheadInputElement.nativeElement.value;
        console.log("option Is Valid ? " + this.isValidOption(inputvalue));
        if (!this.isValidOption(inputvalue)) {
            this.typeaheadInputElement.nativeElement.value = "";
            this.onChangeCallback(null);
            this.selectedOption = null;
        }
    };
    DropaheadComponent.prototype.onDOMClick = function (event) {
        if (!this._eref.nativeElement.contains(event.target)) {
            this.suggestionsVisiable = false;
        }
    };
    DropaheadComponent.prototype.onMouseOver = function (event, option) {
        //TODO : remove css that controll hover,
        this.highlightedOption = option;
    };
    DropaheadComponent.prototype.isValidOption = function (value) {
        console.log("isValid passed value " + value);
        var option = value;
        for (var index = 0; index < this.options.length; index++) {
            if (this.fieldName) {
                if (value == this.options[index][this.fieldName]) {
                    return true;
                }
            }
            else {
                if (value == this.options[index]) {
                    return true;
                }
            }
        }
        return false;
    };
    DropaheadComponent.prototype.getSelectedOption = function () {
        return this.selectedOption ? this.selectedOption[this.fieldName] : "";
    };
    DropaheadComponent.prototype.setSelectedOption = function (option) {
        this.fieldName ? this.selectedOption = option[this.fieldName] : this.selectedOption = option;
    };
    __decorate([
        core_1.ViewChild('typeaheadInputElement'), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "typeaheadInputElement", void 0);
    __decorate([
        core_1.ViewChild('suggestionDiv'), 
        __metadata('design:type', core_1.ElementRef)
    ], DropaheadComponent.prototype, "suggestionDiv", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "searchMinChar", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "hasFocus", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "fieldName", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "initValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DropaheadComponent.prototype, "options", void 0);
    __decorate([
        core_1.HostListener('document:click', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], DropaheadComponent.prototype, "onDOMClick", null);
    DropaheadComponent = __decorate([
        core_1.Component({
            selector: 'dropahead',
            template: " <div  class=\"dropaheadcontainer\" *ngIf=\"options\">\n  <form class=\"dropahead-form\" >\n    <!--if the option are array of string the first input will appear\n    the (input) passing flag for if the options are object\n     -->\n     <div class=\"input-group\">\n   <input *ngIf=\"!fieldName\" #typeaheadInputElement (keydown)=\"keyHandler($event)\" (input)=\"inputChangehandler($event,false)\"  class=\"form-control\"  type=\"text\" (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [(ngModel)]=\"selectedOption\"  > \n    <input *ngIf=\"fieldName\" #typeaheadInputElement (keydown)=\"keyHandler($event)\" (input)=\"inputChangehandler($event,true)\"  class=\"form-control\"  type=\"text\" (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [ngModel]=\"getSelectedOption()\"  >\n   <span class=\"input-group-addon\" id=\"basic-addon2\" (click)=\"dropdownHandler()\"><button class=\"clean\">\u2193</button></span>\n     </div>\n   <ul *ngIf=\"suggestionsVisiable\" class=\"suggestions\" #suggestionDiv >\n <span *ngIf=\"fieldName\" >   <li  *ngFor=\"let option of suggestions\" class=\"list-group-item\" [class.active]=\"option == highlightedOption\" \n      (click)=\"optionClickHandler(option)\" (mouseenter)=\"onMouseOver($event,option)\">{{ option[fieldName] }}</li>\n</span>\n  <span *ngIf=\"!fieldName\" > \n     <li *ngFor=\"let option of suggestions\" class=\"list-group-item\" [class.active]=\"option == highlightedOption\" \n      (click)=\"optionClickHandler(option)\" (mouseenter)=\"onMouseOver($event,option)\">{{option}}</li>\n     \n  </span>\n  </ul>\n    </form>\n  </div>\n",
            providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
            styles: [" \n    .dropaheadcontainer{\n      width: 160px;\n     float: left;\n \n    \n    }\n    \n    input.dropaheadsearch {\n      position: relative;\n      z-index: 2;\n      width: 150px;\n      font-size: 12px;\n      \n    }\n       .dropaheadDropdownButton {\n\n    height: 12px;\n    position: relative; \n    width: 12px;\n    z-index: 3;\n\tbackground-color:#00bfff;\n\t-moz-border-radius:4px;\n\t-webkit-border-radius:4px;\n\tborder-radius:4px;\n\tdisplay:inline-block;\n\tcursor:pointer;\n\tcolor:#ffffff;\n\tfont-family:Arial;\n\tfont-size:12px;\n\ttext-decoration:none;\n\n\n\n    }\n    .dropaheadDropdownButton:hover {\n\n\tbackground-color:#019ad2;\n    }\n    .dropaheadDropdownButton:active {\n\ttop:1px;\n}\n\n  \n\n    .suggestions {\n  height: auto;\n    max-height: 200px;\n    overflow-x: hidden;\n      padding: 0;\n      position: relative;\n      transition: ease-in;\n      box-shadow: 0 2px 1px 0 #dcdcdc,0 -2px 1px 0 #dcdcdc;;\n  overflow: scroll; \n    -webkit-animation: fadein .5s; \n            animation: fadein .5s;\n    }\n    \n    .suggestionsoption {\n      background: white;\n      border-bottom: 1px solid #D8D8D8;\n      padding: 10px;\n      transition: background 0.2s;\n      display: flex;\n       \n      \n      text-transform: capitalize;\n    }\n  /*.suggestionsoption:hover {\n      background: gray;\n     \n  }*/\n     .suggestionselected {\n      background: gray;\n     \n  }\n \n  \n    \n    span.population {\n      font-size: 12px;\n    }\n    \n    .details {\n      text-align: center;\n      font-size: 10px;\n    }\n    \n    .hl {\n      background: #ffc600;\n    }\n    \n    .love {\n      text-align: center;\n      line-height: 2;\n    }\n    \n    a {\n      color: black;\n      background: rgba(0, 0, 0, 0.1);\n      text-decoration: none;\n    }\n    .dropaheadDropdownButton {\n    height: 25px;\n    width: 25px;\n    }\n\n\n@keyframes fadein {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n}\n\n/* Firefox < 16 */\n@-moz-keyframes fadein {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n}\n\n/* Safari, Chrome and Opera > 12.1 */\n@-webkit-keyframes fadein {\n    from { opacity: 0; }\n    to   { opacity: 1; }\n}\n\nbutton.clean {\n\n    background: transparent;\n    border: none ;\n    font-size:12px;\n\n}"],
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], DropaheadComponent);
    return DropaheadComponent;
}());
exports.DropaheadComponent = DropaheadComponent;
//# sourceMappingURL=dropahead.component.js.map