const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = './protos/risk_mgmt.proto';

// Load the protobuf
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const riskmanagement = grpc.loadPackageDefinition(packageDefinition).riskmanagement;
console.log(riskmanagement)

// Mock user data (In a real application, you would query a database)
const users = {
    'user1': { funds: 1000 },
    'user2': { funds: 500 }
};

// Implement the CheckOrderValidity function
function checkOrderValidity(call, callback) {
    const user = users[call.request.user_id];
    console.log(callback);
    if (!user) {
        callback(null, { is_valid: false, message: 'User not found' });
    } else if (user.funds < call.request.order_amount) {
        callback(null, { is_valid: false, message: 'Insufficient funds' });
    } else {
        callback(null, { is_valid: true, message: 'Order is valid' });
    }
}

// Start the gRPC server
function main() {
    const server = new grpc.Server();
    server.addService(riskmanagement.RiskManagement.service, { checkOrderValidity: checkOrderValidity,checkOrderValidity1: checkOrderValidity});
    const port = '0.0.0.0:50051';
    server.bindAsync(port, grpc.ServerCredentials.createInsecure(), () => {
        console.log(`Server running at ${port}`);
    });
}

main();

