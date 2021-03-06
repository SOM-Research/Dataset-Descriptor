import { AstNode, LangiumParser } from 'langium';
import { DescriptionDataset, isDescriptionDataset } from './generated/ast';
import { DatasetDescriptorServices } from './dataset-descriptor-module';


//import { AnyRecord } from 'dns';
//import { forEach } from 'mathjs';

export interface Generator {
    generate(Declaration : string | AstNode) : string | undefined;
}

/**
 * Generator for HTML that implements Declaration.
 */
export class DocumentationGenerator implements Generator {

    private readonly parser: LangiumParser;

    constructor(services: DatasetDescriptorServices) {
        this.parser = services.parser.LangiumParser;
    }

    generate(DescriptionDataset : string | AstNode) : string | undefined {
        const astNode = (typeof(DescriptionDataset) == 'string' ? this.parser.parse(DescriptionDataset).value : DescriptionDataset);
        return (isDescriptionDataset(astNode) ? this.Declaration2Html(astNode) : undefined);
    }

    Declaration2Html(DescriptionDataset : DescriptionDataset) : string {

        const description = {
            title : DescriptionDataset.elements[0].name,
            metadata : DescriptionDataset.elements[0].generalinfo,
            composition : DescriptionDataset.elements[0].composition,
            provenance : DescriptionDataset.elements[0].provenance,
            socialConcerns : DescriptionDataset.elements[0].socialConcerns,
        }

        let head = `
<html>
        <head>
            <title>${description.title}</title>
            <meta charset="utf-8"/>`;
        head = this.addSchemaOrg(description, head, description.title)
        head = this.addStyles(head);
        let body = this.buildBody(description);
        head = head + 
    `</head>` 
      const html = head + body 
      return html
        
    }

    addSchemaOrg(description: any, head: string, title: string) : string {

        // Add Authors
        let authors = ""
        description.metadata.authoring.authors[0].authors.forEach(function (author: any) {

            authors = authors + 
        `"creator":{
            "@type":"Author",
            "url": "",
            "name":"${author.name}",
            "contactPoint":{
                "@type":"ContactPoint",
                "contactType": "email,
                "email":${author.email}
            }
        },
    `

        })

        // Add funders
        let funders = ""
        description.metadata.authoring.founding[0].funders.forEach(function (funder: any) {
                
                funders = funders + 
            `"funder":{
                "@type":"Funder",
                "name":"${funder.name}",
                "sameAs":"${funder.type}"
            },
        `
    
        })

        head = head + `
        <script type="application/ld+json">
        {
        "@context":"https://schema.org/",
        "@type":"Dataset",
        "name":"${title}",
        "description":${description.metadata.descriptionpurpose},
        "url":"",
        "sameAs":"",
        "identifier": [${description.metadata.ident}],
        "keywords":[
            "AREA > ${description.metadata.area.area[0]}",
            "TAGS > ${JSON.stringify(description.metadata.tags.tags)}",
        ],
        "license" : ${description.metadata.licence},
        "hasPart" : [
            {
            "@type": "Dataset",
            "name": ${description.composition.instances[0].instances[0].name},
            "description": ${description.composition.instances[0].instances[0].descript},
            },
        ],
        "includedInDataCatalog":{
            "@type":"DataCatalog",
            "name":"data.gov"
        },
        "distribution":[
            {
                "@type":"DataDownload",
                "encodingFormat":"CSV",
                "contentUrl":"http://www.ncdc.noaa.gov/stormevents/ftp.jsp"
            },
            {
                "@type":"DataDownload",
                "encodingFormat":"XML",
                "contentUrl":"http://gis.ncdc.noaa.gov/all-records/catalog/search/resource/details.page?id=gov.noaa.ncdc:C00510"
            }
        ],
        "temporalCoverage":"${description.metadata.datesR}/${description.metadata.datesU}",
     `;

        head = head + authors + funders + ` 
        }
        </script>`
        return head;
    }

    addStyles(head: string) : string {
        return head + `        
    <style>
        table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
        }

        td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        background-color:grey
        }

        tr:nth-child(even) {
        background-color: #dddddd;
        }
    </style>`
    }

    buildBody(description: any) : any {

        const pug = require('pug');
        const path = require('path')
        let sep = path.sep
        let dirname = __dirname;
        // Compile the source code
        const compiledFunction = pug.compileFile(dirname+sep+'templates'+sep+'document.pug');
        // Compile the source code
        return compiledFunction({
            description: description
          });

        /*
<html>
    <body>
        <h1> Documentation of ${description.title} </h1>
        <br>
        <div> 
            <h2> Who created the dataset? </h2>
            <table>
                <tr>
                <th>Name</th>
                <th>email</th>
                </tr>
                <tr>
                <td>${description.metadata.authoring.authors[0].authors[0].name}</td>
                <td>${description.metadata.authoring.authors[0].authors[0].email}</td>
                </tr>
                <tr>
                <td>${description.metadata.authoring.authors[0].authors[1].name}</td>
                <td>${description.metadata.authoring.authors[0].authors[1].email}</td>
                </tr>
            </table>
        </div>
        <div>
            <h2> For what prupose was the dataset created?</h2>
            <p> ${description.metadata.descriptionpurpose}</p>
        </div>
        <div>
            <h2> Was there any specific tasks?</h2>
            <p> ${description.metadata.descriptionTasks}</p>
        </div>
        <div>
            <h2> Was there a specific gap that needed to be filled?d?</h2>
            <p> ${description.metadata.descriptionGaps}</p>
        </div>

       
    </body>
`*/
    }
}
