const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null for backward compatibility
      immutable: true, // Cannot be changed once set
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "card"], // Updated: Only COD and Card
      default: "cod",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // ============================================
    // STRIPE PAYMENT FIELDS (Card Payments)
    // ============================================
    stripePaymentIntentId: {
      type: String,
      default: null, // Stripe Payment Intent ID
    },

    paidAt: {
      type: Date,
      default: null, // When payment is confirmed (Card or Admin manually for COD)
    },

    // ============================================
    // STRIPE FIELDS (DISABLED - Keep for future use)
    // ============================================
    // Uncomment these when re-enabling card payments
    /*
  paymentIntentId: {
    type: String,
    default: null
  },
  stripePaymentId: {
    type: String,
    default: null
  },
  cardLast4: {
    type: String,
    default: null
  },
  cardBrand: {
    type: String,
    default: null
  },
  */

    orderStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },

    // WhatsApp Confirmation
    whatsappConfirmed: {
      type: Boolean,
      default: false,
    },
    whatsappConfirmedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
