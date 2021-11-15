import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Options } from '@angular-slider/ngx-slider';

export type RangeSliderOptions = Options;

@Component({
    selector: 'app-range-slider',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RangeSliderControlComponent),
        multi: true
    }]
})

export class RangeSliderControlComponent implements ControlValueAccessor, OnInit{
    @Input()
    options: RangeSliderOptions;

    data: RangeSliderValues = {} as RangeSliderValues;
    disabled: boolean;
    onChange: any = () => { };

    ngOnInit(): void {
        if (!this.options){
            this.options = {
                floor: 1,
                ceil: 5,
                showTicksValues: true,
                ticksArray: [1, 2, 3, 4, 5]
            };
        }
    }

    writeValue(value: RangeSliderValues): void {
        if (value){
            this.data = value;
        }
        else{
            this.data = {
                value: this.options.ticksArray[0],
                highValue: this.options.ticksArray[this.options.ticksArray.length - 1]
            };
        }
    }

    emitChange(): void {
        this.onChange(this.data);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}

export interface RangeSliderValues {
    value: number;
    highValue: number;
}
