"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatasetDescriptorServices = exports.DatasetDescriptorModule = void 0;
// import { createDefaultModule, DefaultModuleContext, inject, LangiumServices, Module, PartialLangiumServices } from 'langium';
const langium_1 = require("langium");
const module_1 = require("./generated/module");
const dataset_descriptor_validator_1 = require("./dataset-descriptor-validator");
const dataset_descriptor_index_1 = require("./dataset-descriptor-index");
const dataset_description_documentation_1 = require("./dataset-description-documentation");
const dataset_descriptor_uploader_1 = require("./dataset-descriptor-uploader");
/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
exports.DatasetDescriptorModule = {
    validation: {
        ValidationRegistry: (injector) => new dataset_descriptor_validator_1.DatasetDescriptorValidationRegistry(injector),
        DatasetDescriptorValidator: () => new dataset_descriptor_validator_1.DatasetDescriptorValidator()
    },
    index: {
        AstNodeDescriptionProvider: (services) => new dataset_descriptor_index_1.DatasetDescriptorDescriptionProvider(services)
    },
    generation: {
        DocumentationGenerator: (injector) => new dataset_description_documentation_1.DocumentationGenerator(injector)
    },
    uploader: {
        DatasetUploader: (injector) => new dataset_descriptor_uploader_1.DatasetUploader(injector)
    }
};
/**
 * Inject the full set of language services by merging three modules:
 *  - Langium default services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 */
function createDatasetDescriptorServices(context) {
    const shared = (0, langium_1.inject)((0, langium_1.createDefaultSharedModule)(context), module_1.datasetDescriptorGeneratedSharedModule);
    const datasetDescription = (0, langium_1.inject)((0, langium_1.createDefaultModule)({ shared }), module_1.DatasetDescriptorGeneratedModule, exports.DatasetDescriptorModule);
    shared.ServiceRegistry.register(datasetDescription);
    return { shared, datasetDescription };
}
exports.createDatasetDescriptorServices = createDatasetDescriptorServices;
//# sourceMappingURL=dataset-descriptor-module.js.map