/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject ,describe,it,expect} from '@angular/core/testing';
import { DropaheadComponent } from './dropahead.component';

describe('Component: Dropahead', () => {
  it('should create an instance', () => {
    let component = new DropaheadComponent(null,null);
    expect(component).toBeTruthy();
  });
});
