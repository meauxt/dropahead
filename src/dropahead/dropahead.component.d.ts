import { EventEmitter, OnInit, ElementRef, Renderer } from '@angular/core';
import { ControlValueAccessor } from "@angular/common";
export declare class DropaheadComponent implements OnInit, ControlValueAccessor {
    private _eref;
    private _renderer;
    typeaheadInputElement: any;
    suggestionDiv: ElementRef;
    searchMinChar: number;
    hasFocus: EventEmitter<{}>;
    fieldName: any;
    initValue: any;
    options: any;
    suggestions: any[];
    selectedOption: any;
    highlightedOption: any;
    highlightedOptionIndex: number;
    suggestionsVisiable: boolean;
    private _value;
    onTouchedCallback: (_: any) => void;
    onChangeCallback: (_: any) => void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    value: any;
    ngOnInit(): void;
    constructor(_eref: ElementRef, _renderer: Renderer);
    logger(any: any): void;
    search(query: any, isObject?: boolean): void;
    logHeight(): void;
    keyHandler(event: any): void;
    optionClickHandler(option: any): void;
    inputChangehandler(event: any, isObject?: boolean): void;
    dropdownHandler(): void;
    onFocus(event: Event): void;
    onBlur(event: Event): void;
    onDOMClick(event: any): void;
    onMouseOver(event: Event, option: number): void;
    isValidOption(value: any): boolean;
    getSelectedOption(): any;
    setSelectedOption(option: any): void;
}
