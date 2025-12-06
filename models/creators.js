const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = mongoose.Schema.Types.ObjectId;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var Schema = mongoose.Schema;

const CreatorsSchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
    },
    audience: {
        type: Number,
    },
    logo: {
        type: String,
    },
    industry:  [String],
    description: {
        type: String,
    },
    contact: {
        type: String,
    },
    type: {
        type: String,
    },
    price: {
        type: Number,
    },
    openrate: {
        type: Number,
    },
    advertiseurl: {
        type: String,
    },
    twitter: {
        type: String,
    },
    link: {
        type: String,
    },
    paved: {
        type: String,
    },
    hecto: {
        type: String,
    },
    swapstack: {
        type: String,
    },
    // category: {
    //     type: String,
    // },
    author: {
        type: ObjectId,
        ref: 'users',
    },
    slug: {
        type: String,
        slug: ["name"]
    },
    // New marketplace fields
    listingType: {
        type: String,
        enum: ['get-sponsors', 'sponsor-others', 'cross-promote'],
        default: 'get-sponsors'
    },
    verified: {
        type: Boolean,
        default: false
    },
    subscribers: {
        type: Number
    },
    openRate: {
        type: Number // percentage
    },
    clickRate: {
        type: Number // percentage
    },
    topics: [String],
    // Legacy pricing fields (keep for backward compatibility)
    pricing: {
        sponsorshipPrice: Number,
        promotionPrice: Number,
        swapAvailable: Boolean
    },
    // Advanced pricing packages
    pricingPackages: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        type: {
            type: String,
            enum: ['sponsored-post', 'newsletter-mention', 'banner-ad', 'product-review', 'cross-promotion', 'social-media', 'podcast-mention', 'custom'],
            default: 'sponsored-post'
        },
        deliverables: [String], // e.g. ["Email newsletter placement", "Social media mention", "Analytics report"]
        duration: {
            type: String,
            default: 'one-time' // 'one-time', 'weekly', 'monthly'
        },
        impressions: Number, // estimated reach
        isPopular: {
            type: Boolean,
            default: false
        },
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    // RSS and API integration
    rssUrl: {
        type: String
    },
    platform: {
        type: String,
        enum: ['beehiiv', 'substack', 'convertkit', 'mailchimp', 'other']
    },
    apiConnected: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // AI-generated content
    aiSummary: {
        type: String
    },
    latestIssue: {
        title: String,
        url: String,
        date: Date
    },
    // Previous sponsors for social proof
    previousSponsors: [{
        name: { type: String, required: true },
        logo: String,
        website: String,
        sponsorshipDate: Date,
        sponsorshipType: {
            type: String,
            enum: ['newsletter', 'podcast', 'banner', 'content', 'event', 'other'],
            default: 'newsletter'
        },
        testimonial: String
    }],
    // Live Stats Integration
    liveStats: {
        enabled: {
            type: Boolean,
            default: false
        },
        platform: {
            type: String,
            enum: ['beehiiv', 'substack', 'manual'],
            default: 'manual'
        },
        // API credentials (encrypted) - only for owned newsletters
        apiKey: String,
        publicationId: String,
        // Current stats
        currentStats: {
            subscribers: Number,
            openRate: Number,
            clickRate: Number,
            revenue: Number,
            lastUpdated: Date
        },
        // Stats history for tracking growth
        statsHistory: [{
            date: Date,
            subscribers: Number,
            openRate: Number,
            clickRate: Number,
            revenue: Number,
            source: {
                type: String,
                enum: ['api', 'manual'],
                default: 'manual'
            },
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }],
        // Sync settings
        autoSync: {
            type: Boolean,
            default: true
        },
        syncFrequency: {
            type: String,
            enum: ['hourly', 'daily', 'weekly'],
            default: 'daily'
        }
    },
    // Manual tracking by other users (for competitive analysis)
    manualTracking: [{
        trackedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        stats: {
            subscribers: Number,
            openRate: Number,
            clickRate: Number,
            revenue: Number
        },
        notes: String,
        source: String, // Where they got the data from
        date: {
            type: Date,
            default: Date.now
        }
    }],
    // AI Analysis for brand matching
    aiAnalysis: {
        // Content themes and categories
        contentThemes: [String], // e.g. ["technology", "productivity", "startups", "AI"]
        audienceType: {
            type: String,
            enum: ['B2B professionals', 'tech enthusiasts', 'entrepreneurs', 'general consumers', 'developers', 'marketers', 'investors', 'creators', 'students', 'other']
        },
        writingStyle: {
            type: String,
            enum: ['professional', 'casual', 'educational', 'entertaining', 'analytical', 'inspirational']
        },
        // Brand fit scores (0-100)
        brandFitScores: {
            productLaunch: { type: Number, min: 0, max: 100 },
            saasTools: { type: Number, min: 0, max: 100 },
            travel: { type: Number, min: 0, max: 100 },
            finance: { type: Number, min: 0, max: 100 },
            ecommerce: { type: Number, min: 0, max: 100 },
            education: { type: Number, min: 0, max: 100 },
            healthcare: { type: Number, min: 0, max: 100 },
            lifestyle: { type: Number, min: 0, max: 100 },
            b2bServices: { type: Number, min: 0, max: 100 },
            consumerApps: { type: Number, min: 0, max: 100 }
        },
        // Generated insights for brands
        insights: [String], // e.g. ["Great for product launches - high engagement with new tools", "Ideal for B2B SaaS - audience of decision makers"]
        // Previous sponsor analysis
        sponsorPatterns: {
            mostCommonSponsorTypes: [String],
            averageEngagementBySponsorType: [{
                category: String,
                engagement: Number
            }],
            bestPerformingSponsors: [String]
        },
        // Analysis metadata
        lastAnalyzed: Date,
        analysisVersion: {
            type: String,
            default: '1.0'
        },
        confidence: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        // Enhanced content analysis
        contentQuality: {
            sponsorFriendlyScore: { type: Number, min: 0, max: 100 }, // How well content integrates sponsors
            brandSafetyScore: { type: Number, min: 0, max: 100 },     // Controversial content risk
            professionalismScore: { type: Number, min: 0, max: 100 }, // Writing quality
            contentConsistency: { type: Number, min: 0, max: 100 },   // Quality consistency
            engagementPredictors: [String] // What drives engagement
        },
        // Deep audience intelligence
        audienceInsights: {
            purchasingPower: {
                type: String,
                enum: ['high', 'medium', 'low', 'unknown']
            },
            techSavviness: { type: Number, min: 1, max: 10 },
            decisionMakerLevel: {
                type: String,
                enum: ['C-suite', 'senior-manager', 'manager', 'individual-contributor', 'mixed', 'unknown']
            },
            industryFocus: [String], // Primary industries discussed
            painPoints: [String],    // Common problems mentioned
            interests: [String],     // Personal interests beyond work
            geographicSignals: [String] // Geographic indicators if any
        },
        // Competitive positioning
        competitiveInsights: {
            uniquePositioning: String,     // What makes newsletter different
            contentGaps: [String],         // Topics competitors don't cover  
            voiceAndTone: String,          // Unique communication style
            nicheAuthority: { type: Number, min: 0, max: 100 }, // Authority in space
            competitiveAdvantage: { type: Number, min: 0, max: 100 }
        },
        // Predictive metrics
        predictiveMetrics: {
            viralityPotential: { type: Number, min: 0, max: 100 },
            conversionPotential: { type: Number, min: 0, max: 100 },
            retentionRisk: { type: Number, min: 0, max: 100 },
            growthPotential: { type: Number, min: 0, max: 100 }
        },
        // Sponsor integration analysis
        sponsorIntegration: {
            nativeAdPotential: { type: Number, min: 0, max: 100 },
            audienceTrust: { type: Number, min: 0, max: 100 },
            purchaseIntentSignals: { type: Number, min: 0, max: 100 },
            optimalPlacement: [String], // Where sponsors work best
            recommendedFormats: [String] // Best sponsor content formats
        },
        // Data sources used for analysis
        dataSources: [{
            type: String,
            source: String, // URL or description
            analyzedAt: Date
        }]
    }
});

function autopopulate(next) {
    this.populate('author');
    next();
}

module.exports = mongoose.model('creators', CreatorsSchema);