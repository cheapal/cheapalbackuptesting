import mongoose from 'mongoose';
import SellerDashboard from './models/SellerDashboard.js'; // Adjust the path to your model

// Load environment variables
import 'dotenv/config';

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

// Sample seller ID
const SAMPLE_SELLER_ID = 'seller123'; // Replace with an actual seller ID or generate one dynamically

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// Create or update a sample seller dashboard
async function createOrUpdateSellerDashboard(sellerId) {
  try {
    const existingDashboard = await SellerDashboard.findOne({ sellerId });

    if (!existingDashboard) {
      // Create a new seller dashboard
      const newDashboard = new SellerDashboard({
        sellerId,
        name: 'John Doe',
        email: 'johndoe@example.com',
        storeName: "John's Store",
        products: [
          {
            productId: 'P001',
            name: 'Wireless Headphones',
            price: 99.99,
            quantity: 50,
            category: 'Electronics',
            images: ['https://example.com/product1.jpg'],
          },
        ],
        orders: [
          {
            orderId: 'O001',
            buyerId: 'buyer123',
            products: [{ productId: 'P001', quantity: 2, price: 99.99 }],
            totalAmount: 199.98,
            status: 'Delivered',
          },
        ],
        totalRevenue: 199.98,
        analytics: {
          totalSales: 1,
          topSellingProducts: [{ productId: 'P001', salesCount: 2 }],
          monthlyRevenue: [{ month: 'October', revenue: 199.98 }],
        },
      });

      await newDashboard.save();
      console.log('✅ Created new seller dashboard');
    } else {
      // Update existing dashboard with sample data
      existingDashboard.products.push({
        productId: 'P002',
        name: 'Smartwatch',
        price: 149.99,
        quantity: 30,
        category: 'Wearables',
        images: ['https://example.com/product2.jpg'],
      });

      existingDashboard.orders.push({
        orderId: 'O002',
        buyerId: 'buyer456',
        products: [{ productId: 'P002', quantity: 1, price: 149.99 }],
        totalAmount: 149.99,
        status: 'Shipped',
      });

      existingDashboard.totalRevenue += 149.99;
      existingDashboard.analytics.totalSales += 1;
      existingDashboard.analytics.topSellingProducts.push({
        productId: 'P002',
        salesCount: 1,
      });
      existingDashboard.analytics.monthlyRevenue.push({
        month: 'November',
        revenue: 149.99,
      });

      await existingDashboard.save();
      console.log('✅ Updated existing seller dashboard');
    }
  } catch (error) {
    console.error('❌ Error creating/updating seller dashboard:', error.message);
  }
}

// Fetch and validate seller dashboard data
async function fetchAndValidateDashboard(sellerId) {
  try {
    const dashboard = await SellerDashboard.findOne({ sellerId });

    if (!dashboard) {
      console.error('❌ No seller dashboard found for sellerId:', sellerId);
      return;
    }

    console.log('✅ Seller Dashboard Found:');
    console.log({
      sellerId: dashboard.sellerId,
      storeName: dashboard.storeName,
      totalRevenue: dashboard.totalRevenue,
      totalSales: dashboard.analytics.totalSales,
      topSellingProducts: dashboard.analytics.topSellingProducts,
      monthlyRevenue: dashboard.analytics.monthlyRevenue,
    });

    // Validate required fields
    if (
      !dashboard.products ||
      !dashboard.orders ||
      !dashboard.totalRevenue ||
      !dashboard.analytics
    ) {
      console.error('❌ Seller dashboard is missing required fields');
      return;
    }

    console.log('✅ All required fields are present in the seller dashboard');
  } catch (error) {
    console.error('❌ Error fetching seller dashboard:', error.message);
  }

}

// Main function
async function main() {
  try {
    // Step 1: Connect to the database
    await connectToDatabase();

    // Step 2: Create or update a sample seller dashboard
    await createOrUpdateSellerDashboard(SAMPLE_SELLER_ID);

    // Step 3: Fetch and validate the seller dashboard
    await fetchAndValidateDashboard(SAMPLE_SELLER_ID);
  } catch (error) {
    console.error('❌ Script failed:', error.message);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the script
main();


