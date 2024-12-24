import mongoose from "mongoose";

const parcelSchema = new mongoose.Schema({
    orderID:{
        type:String,
        required: true,
    },
    parcelType: {
        type: String,
        enum: ['document', 'Box', 'Suitcase', 'Backpack', 'Other'],
        required: true
    },
    weight: {
        type: Number,
        required: true, // Make weight required for all package types
        message: 'Weight is required.'
    },
    length: {
        type: Number,
        required: function() {
            // Only required for 'Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', or 'Other'
            return ['Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', 'Other'].includes(this.parcelType);
        },
        message: 'Length is required for Box/Cartoon, Suitcase/Luggage, Backpack/Handbag, or Other.'
    },
    breadth: {
        type: Number,
        required: function() {
            // Only required for 'Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', or 'Other'
            return ['Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', 'Other'].includes(this.parcelType);
        },
        message: 'Breadth is required for Box/Cartoon, Suitcase/Luggage, Backpack/Handbag, or Other.'
    },
    height: {
        type: Number,
        required: function() {
            // Only required for 'Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', or 'Other'
            return ['Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', 'Other'].includes(this.parcelType);
        },
        message: 'Height is required for Box/Cartoon, Suitcase/Luggage, Backpack/Handbag, or Other.'
    },
    fragile: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
});

// Pre-save hook to adjust field values if necessary
parcelSchema.pre('save', function(next) {
    if (this.parcelType === 'document') {
        this.length = undefined;
        this.breadth = undefined;
        this.height = undefined;
    } else if (['Box/Cartoon', 'Suitcase/Luggage', 'Backpack/Handbag', 'Other'].includes(this.parcelType)) {
        this.weight = this.weight; // Make sure weight stays in place
    }

    next();
});

const parcelModel = mongoose.model('parcel', parcelSchema);
export default parcelModel;
