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
                var splited = currentOption.split(" ");
                var splitedQuery = query.value.split(" ");
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
                this.suggestionsVisiable = false;
            }
        }
    };
    DropaheadComponent.prototype.keyHandler = function (event) {
        switch (event.keyCode) {
            case 38:
                //    Key : Up Arrow
                if (this.suggestionDiv.nativeElement.scrollTop > 0)
                    this.suggestionDiv.nativeElement.scrollTop -= 38;
                if (this.highlightedOptionIndex <= this.suggestions.length && this.highlightedOptionIndex >= 0) {
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
                // Key : Down Arrow
                if (this.highlightedOptionIndex < this.suggestions.length) {
                    if (this.suggestionDiv.nativeElement.scrollTop < this.suggestionDiv.nativeElement.scrollHeight && this.highlightedOption)
                        this.suggestionDiv.nativeElement.scrollTop += 38;
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
                // Key : Enter 
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
                if (this.typeaheadInputElement.nativeElement.value == "") {
                    this.dropdownHandler();
                    break;
                }
                //to clear the current suggestion so after user select one if click on the field again nothing going to be shown
                this.suggestions = [];
                break;
            case 9:
                // Key : TAB 
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
        if (!this.suggestionsVisiable) {
            this.suggestions = this.options;
            this.suggestionsVisiable = true;
            //dropdown need the field to be emtpy to get all the value otherwise it going to query for the available value 
            //setting the time out 500 so the event wont effect the field and auto select the first option
            setTimeout(function (_) {
                return _this._renderer.invokeElementMethod(_this.typeaheadInputElement.nativeElement, 'focus', []);
            }, 500);
        }
        else {
            this.suggestionsVisiable = false;
        }
    };
    DropaheadComponent.prototype.onFocus = function (event) {
        this.onTouchedCallback("");
        this.hasFocus.emit(true);
        this._hasfocus = true;
        if (this.selectedOption) {
        }
        //  this.suggestionsVisiable=true
    };
    DropaheadComponent.prototype.onBlur = function (event) {
        this.hasFocus.emit(false);
        this._hasfocus = false;
        var inputvalue = this.typeaheadInputElement.nativeElement.value;
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
        this.highlightedOptionIndex = this.findOptionIndex(option);
    };
    DropaheadComponent.prototype.findOptionIndex = function (option) {
        for (var index = 0; index < this.options.length; index++) {
            if (option == this.options[index]) {
                return index;
            }
        }
    };
    DropaheadComponent.prototype.isValidOption = function (value) {
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
            moduleId: module.id,
            selector: 'dropahead',
            template: ["<div  class=\"dropaheadcontainer\" *ngIf=\"options\">\n  <form>\n    <!--if the option are array of string the first input will appear\n    the (input) passing flag for if the options are object\n     -->\n\n     <div class=\"input-group-container\">\n  <div class=\"input-group-container-background\"></div>\n   <input *ngIf=\"!fieldName\" #typeaheadInputElement (keydown)=\"keyHandler($event)\" (input)=\"inputChangehandler($event,false)\"  class=\"dropahead-input \"  type=\"text\" (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [(ngModel)]=\"selectedOption\"  > \n    <input *ngIf=\"fieldName\" #typeaheadInputElement (keydown)=\"keyHandler($event)\" (input)=\"inputChangehandler($event,true)\"  class=\"dropahead-input \"  type=\"text\" (focus)=\"onFocus($event)\" (blur)=\"onBlur($event)\" [ngModel]=\"getSelectedOption()\"  >\n   <!--<span class=\"dropahead-button\" (click)=\"dropdownHandler()\"><button class=\"clean\">\u25BE</button></span>-->\n      <button class=\"dropahead-button\" (click)=\"dropdownHandler()\" [class.dropahead-button-hide]=\"_hasfocus\">\u25BE</button>\n\n     </div>\n     <div  *ngIf=\"suggestionsVisiable\" class=\"suggestion-container\">\n       <div class=\"suggestion-container-background\"></div>\n   <ul class=\"suggestions\" #suggestionDiv>\n     <span *ngIf=\"fieldName\">\n       <li *ngFor=\"let option of suggestions\" class=\"suggestionsoption\"\n                                    [class.suggestionselected]=\"option == highlightedOption\"\n                                    (click)=\"optionClickHandler(option)\" (mouseenter)=\"onMouseOver($event,option)\">\n                                    {{option[fieldName] }}\n       </li>\n     </span>\n     <span *ngIf=\"!fieldName\">\n       <li *ngFor=\"let option of suggestions\" class=\"suggestions\"\n           [class.suggestionselected]=\"option == highlightedOption\"\n           (click)=\"optionClickHandler(option)\" (mouseenter)=\"onMouseOver($event,option)\">{{option}}\n       </li>\n     </span>\n  </ul>\n  </div>\n    </form>\n  </div>"],
            providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
            styles: ["\n    .dropaheadcontainer{\n      width: 210px;\n \n    \n    }\n\n.dropahead-input {\nposition: absolute;\n  top: 0;\n  left: 0;\n  margin-left: 8px;\n  margin-right: 8px;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  width: 200px;\n  height: 40px;\n  border: none;\n  font: normal 16px/normal Arial, Helvetica, sans-serif;\n  color: white;\n  -o-text-overflow: clip;\n  text-overflow: clip;\n  background: rgba(255,255,255,0);\n    outline: 0 !important;\n\n}\n.input-group-container-background {\nposition: absolute;\n    top: 0;\n    left: 0;\n width: 216px;\n  height: 40px;\n  padding: 0px;\n \n  border: none;\n  \n  background: rgb(34,34,34); /* for IE */\n  background: rgba(34,34,34,0.75);\n  -webkit-filter: blur(2px); /* Chrome, Opera, etc. */\n  filter: blur(2px); /* Firefox 35+, eventually all */\n}\n.input-group-container{\n    position: relative;\n    width: auto;\n    height: 40px;\n\n}\n.dropahead-button{\n  position: absolute;\n  \n    top: 0;\n    right: 0;\n    margin: 3px 0;\n    color: white;\n    z-index: 1;\n    background: transparent;\n    border: none ;\n    font-size:24px;\n    outline: 0 ;\n     transition: 0.5s ease-in-out;\n}\n.dropahead-button-hide{\n color: transparent;\n visibility: hidden;\n \n    transition: 0.5s ease-in-out;\n}\n.suggestion-container-background{\nposition: absolute;\n width: 216px;\n  height: 125px;\n  padding: 0px;\n \n  border: none;\n  \n  background: rgb(34,34,34); /* for IE */\n  background: rgba(34,34,34,0.75);\n  -webkit-filter: blur(2px); /* Chrome, Opera, etc. */\n  filter: blur(2px); /* Firefox 35+, eventually all */\n}\n.suggestion-container{\n  margin-top: -3px;\nposition: relative;\n    width: 215px;\n    height: 160px;\n    overflow: hidden;\n}\n\n.suggestions {\n    height: auto;\n    max-height: 125px;\n    width: 230px;\n    padding: 0;\n    z-index: 1000;\n    position: absolute;\n    display: block;\n    transition: ease-in;\n    overflow: auto;\n    -webkit-animation: fadein .5s;\n    animation: fadein .5s;\n    margin: 0;\n    background-color: none;\n    font: normal 14px/normal Arial, Helvetica, sans-serif;\n\n\n}\n\n\n.suggestionsoption {\n  background-color: none;\n  color: white;\n  padding: 10px;\n  height: 18px;\n  transition: background 0.2s ease-out;\n  display: flex;\n  font: normal 14px/normal Arial, Helvetica, sans-serif;\n\n}\n\n.suggestionselected {\n  background: rgba(255,255,255, 0.5);\n  color: black;\n  padding: 10px;\n  height: 18px;\n  transition: background 0.2s ease-in;\n\n\n}\n\n@keyframes fadein {\n  from {\n    opacity: 0;\n  }\n  to { opacity: 1; }\n}\n\n/* Firefox < 16 */\n@-moz-keyframes fadein {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n/* Safari, Chrome and Opera > 12.1 */\n@-webkit-keyframes fadein {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n\n"],
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], DropaheadComponent);
    return DropaheadComponent;
}());
exports.DropaheadComponent = DropaheadComponent;
//# sourceMappingURL=dropahead.component.js.map