import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { Currency } from "../modules/banking/entity/wallet.entity";
import { Status } from "../modules/banking/entity/card.entity";

export function IsCurrency(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsCurrency",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return Object.values(Currency).includes(relatedValue);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Currency should be EUR, GBP, or USD';
                }
            },
        });
    };
}

export function IsStatus(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "IsStatus",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return Object.values(Status).includes(relatedValue);
                },
                defaultMessage(args: ValidationArguments) {
                    return 'Status should be Blocked or Unblocked';
                }
            },
        });
    };
}