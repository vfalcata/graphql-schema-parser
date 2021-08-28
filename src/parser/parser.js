const fs = require('fs')
const path = require("path");

//  ../../../schema/error.graphql

const argInputPath = process.argv[2]
const isRelativePath = !argInputPath.startsWith("fullPath:") || !argInputPath.includes(':')
const schemaPath = isRelativePath? path.resolve(__dirname,argInputPath) : argInputPath.replace("fullPath:",'')

console.log("input", argInputPath)
const file = fs.readFileSync(schemaPath, 'utf8');

const getFieldsFromTypeBodyText = (graphqlSchemaBodyText)=>{
    // const reg = /{([^}]+)}/gm
    // const reg2= /type\s*(\w*)\s*{([^}]+)}/gm
    // const regexp = new RegExp("type\s*" + graphqlSchemaType + "\s*{([^}]+)}", "gm");
    const lines = graphqlSchemaBodyText.split("\n")
    return lines
    .filter(line => line.length>0 && line.includes(":"))
    .map(line=>line.replace(/\s+/g,""))
    .map((line) => {return {fieldName:line.split(':')[0],
        fieldType:line.split(':')[1]
    }})
}

const getTypes = (graphqlSchemaString)=>{
    // const regexp = /\s*type\s*(\w+)\s*{\s*/gm;
    const regexp= /type\s*(\w*)\s*{([^}]+)}/gm;

    graphqlSchemaString
    const results = {};
    [...graphqlSchemaString.matchAll(regexp)].forEach((match)=>{
        results[match[1]]=getFieldsFromTypeBodyText(match[2])
    })
    return results;
}



class field {

}

console.log(getTypes(file))