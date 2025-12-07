import admin from "firebase-admin"; import { readFileSync } from "node:fs"; import { join } from "node:path"; 

const serviceAccount = JSON.parse( readFileSync(join(process.cwd(), "firebase-service-account.json")) 
); 

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), 
}); 

export default admin;