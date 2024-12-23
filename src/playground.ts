
import { db } from "./server/db";


await db.user.create({
    data : {
        emailAddress :  'test@gmail.com',
        firstName : 'Sushanth',
        lastName : 'Nandeti',
    }}
)
 
console.log("Insertion done");