const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const BrandsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    companyName: {
        type: String,
        required: 'You must supply a company name'
    },
    description: {
        type: String,

    },
    industry: {
        type: String,      
    },
    link: {
        type: String,
        required: 'You must supply a link'
    },
    foundedYear: {
        type: String,
        required: 'You must supply the year the company was founded'
    },
    estimatedEmployees: {
        type: String,
        required: 'You must supply the estimated number of employees'
    },
    annualRevenue: {
        type: String,
        required: 'You must supply the annual revenue value'
    },
    marketingBudget: {
        type: String,
        required: 'You must supply the likely marketing budget'
    },
    totalFunding: {
        type: String,
    },
    growthStage: {
        type: String,
        required: 'You must supply the growth stage'
    },
    dataSources: [
        {
            type: {
                type: String,
                required: 'You must specify the type of data source'
            },
            source: {
                type: String,
                required: 'You must specify the source'
            }
        }
    ],
    notes: {
        type: String
    },
    marketingContacts: [  // Changed from a single object to an array of objects
        {
            fullName: {
                type: String,
                default: null,
            },
            email: {
                type: String,
                default: null,
            },
            linkedin: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            accuracyScore: {
                type: Number,
                min: 1,
                max: 5,
                default: 3
            },
            lastUpdated: {
                type: Date,
                default: Date.now
            }
        }
    ],
    slug: {
        type: String,
        slug: ["companyName"]
    }
});

module.exports = mongoose.model('Brands', BrandsSchema);
