# Dropahead
      Dropdown + Typeahead = Dropahead



## Main Updates :
0.0.10 :
      Adding Transparent Design
      Adding CSS Animations 
      Support in-field validation feedback 
            
0.0.6
      Adding Support for ngControl
      Adding Support for NgModel
      Adding Focus Event As output Directive

## Screenshot: 
GIF :
      https://raw.githubusercontent.com/meauxt/dropahead/colorful-validation/dropaheadDEMO.gif




## Installation :
Navigate to the root folder of your project with the terminal and use the command :
npm install dropahead --save


## Configuration with Angular-CLI :
Open angular-cli-build.js and add the following line  to vendorNpmFiles array:

      'dropahead/**/*.js'

Open system-config.js and add this line to the cliSystemConfigPackages array :

     "dropahead": {"defaultExtension": "js"}
     
and under System.config  add this line to the map array :

      "dropahead": 'vendor/dropahead'




## Configuration with Webpack :
Soon...

The MIT License (MIT)
Copyright (c) 2016 Dropahead

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
