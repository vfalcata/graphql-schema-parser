import { rawSchemaText } from './fixtures/raw-schema-text'
import { expectedSchemaObject } from './fixtures/expected-schema-object'
import { generateSchemaObject } from '../parser/graphql-schema-parser'

it('generates a schema object with all the expected properties and values', () => {
    let results = compareSchemaObjects(expectedSchemaObject, generateSchemaObject(rawSchemaText, 'test-schema'))
    expect(results.isEqual).toBe(true)
})

/**
 * Recursive function that ensures that an expected object matches an actual one. checks that at each level all the property names and values are equivalent for each object
 * PRECONDITION: expectedSchemaObject and actualSchemaObject must have 'leaf' (as in bottom of a tree, and not an external empty node) components whose value is a primative
 * BASE CASE: all properties passed in only contain primative values.
 * INDUCTION STEP: if all the child components of the property match, and the current property matches, than the actual and expected match as well
 * POSTCONDITION: returns a boolean if actual and expected object match although this is all that is technically needed more properties were added useful for dubugging info.
 * The added properties useful for debugging is the actual object, expected object, as well as the expected parent and actual parent
 * 
 * @param expectedSchemaObject schema object that should be generated
 * @param actualSchemaObject the actual schema object that was generated
 * @returns an object with information if the expectedSchemaObject and actualSchemaObject match as well as meta information useful for debugging. 
 * isEqual: boolean value denoting if the properties of the input expectedSchemaObject and actualSchemaObject match
 * expected: is the expected property that was checked
 * actual: is the actual property that was checked
 * expectedParent: is the parent which contained the expected property
 * actualParent: is the parent which contained the actual property
 * 
 */
const compareSchemaObjects = (expectedSchemaObject: any, actualSchemaObject: any): { isEqual: boolean, reason?: string, expected: any, actual: any, expectedParent: any, actualParent: any } => {

    let { stringProperties: expectedStringProperties, objectProperties: expected } = splitStringProperties(expectedSchemaObject)
    let { stringProperties: actualStringProperties, objectProperties: actual } = splitStringProperties(actualSchemaObject)
    let isEqual = true

    /* BASE CASE */
    if ((!getKeys(actual) && !getKeys(expected)) || (getKeys(actual).length === 0 && getKeys(expected).length === 0)) {
        if (isKeyValueArrayEqual(expectedStringProperties, actualStringProperties)) {
            return { isEqual: true, reason: "objects match", expected: {}, actual: {}, expectedParent: expectedSchemaObject, actualParent: actualSchemaObject };
        } else {
            return { isEqual: false, reason: "string based properties do not match", expected: expectedStringProperties, actual: actualStringProperties, expectedParent: expectedSchemaObject, actualParent: actualSchemaObject };
        }

    }

    /* INDUCTION STEP*/
    if (!isKeyValueArrayEqual(expectedStringProperties, actualStringProperties)) {
        return { isEqual: false, reason: "string based properties do not match", expected: expectedStringProperties, actual: actualStringProperties, expectedParent: expectedSchemaObject, actualParent: actualSchemaObject };
    }

    if (!isPropertyNamesEqual(getKeys(actual), getKeys(expected))) {
        return { isEqual: false, reason: "object based properties keys do not match", expected: getKeys(expected), actual: getKeys(actual), expectedParent: expectedSchemaObject, actualParent: actualSchemaObject };
    }

    for (const property in expected) {
        let result = compareSchemaObjects(expected[property], actual[property])
        isEqual = isEqual && result.isEqual
        if (!isEqual) {
            return result;
        }
    }
    return { isEqual, reason: "objects match, success", expected: {}, actual: {}, expectedParent: expectedSchemaObject, actualParent: actualSchemaObject };
}

/**
 * gets the keys of an object that has some defined property.
 * @param obj input object
 * @returns array of keys as string of an object that has some defined property.
 */
const getKeys = (obj: any): string[] => {
    let result = []
    for (const property in obj) {
        if (obj[property] && Object.keys(obj[property]).length > 0) {
            result.push(property)
        }
    }
    return result;
}

/**
 * checks if the strings contents in each array match
 * @param arr1 an array of strings
 * @param arr2 another array of strings
 * @returns boolean value if arr1 and arr2 match or not
 */
const isPropertyNamesEqual = (arr1: string[], arr2: string[]) => {
    let result = false;

    for (const arr1Element of arr1) {
        if (arr1Element === 'constructor') {
            continue;
        }
        for (const arr2Element of arr2) {
            if (arr2Element === 'constructor') {
                continue;
            }
            if (arr1Element === arr2Element) {
                result = true;
            }
        }
        if (!result) {
            return false;
        }
    }
    for (const arr2Element of arr2) {
        if (arr2Element === 'constructor') {
            continue;
        }
        for (const arr1Element of arr1) {
            if (arr1Element === 'constructor') {
                continue;
            }
            if (arr2Element === arr1Element) {
                result = true;
            }
        }
        if (!result) {
            return false;
        }
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    return true;
}

/**
 * gets an object and splits it in to two objects, one that contains all properties that are strings, and one that contians all properties that are objects
 * @param object any object
 * @returns two objects, one that contains all properties that are strings the stringProperties, and one that contians all properties that are objects the objectProperties
 */
const splitStringProperties = (object: any) => {
    let stringProperties: { key: string, value: string }[] = []
    let objectProperties: any = {}
    for (const property in object) {
        if (property === 'constructor' || !object[property]) {
            continue;
        }
        if (typeof object[property] === 'string') {
            if (object[property] && object[property].length > 0) {
                stringProperties.push({ key: property, value: object[property] })
            }
        } else {
            //@ts-ignore
            if (object[property]) {
                objectProperties[property] = object[property]
            }

        }
    }
    return {
        stringProperties,
        objectProperties
    }
}

/**
 * checks if the strings contents in each array match
 * @param arr1 an array of key value pairs, representing leaf nodes of object properties which hold a primitive
 * @param arr2 another array of key value pairs, representing leaf nodes of object properties which hold a primitive
 * @returns boolean the key name and value of both arr1 and arr2 match
 */
const isKeyValueArrayEqual = (arr1: { key: string, value: string }[], arr2: { key: string, value: string }[]) => {
    let result = false
    // are all the elements in arr1 inside of arr2?
    for (const arr1Element of arr1) {
        if (arr1Element.key === 'constructor') {
            continue;
        }
        for (const arr2Element of arr2) {
            if (arr2Element.key === 'constructor') {
                continue;
            }
            if (arr1Element.key === arr2Element.key && arr1Element.value === arr2Element.value) {
                result = true;
            }
        }
        if (!result) {
            return false;
        }
    }
    // are all the elements in arr2 inside of arr1?
    for (const arr2Element of arr2) {
        if (arr2Element.key === 'constructor') {
            continue;
        }
        for (const arr1Element of arr1) {
            if (arr1Element.key === 'constructor') {
                continue;
            }
            if (arr1Element.key === arr2Element.key && arr1Element.value === arr2Element.value) {
                result = true;
            }
        }
        if (!result) {
            return false;
        }
    }
    if (arr1.length !== arr2.length) {
        return false;
    }
    return true;
}
