import express from 'express';
import { Request, Response } from 'express';
import { Webhook } from "svix";

require('dotenv').config();
const webhooksroute = express.Router();

webhooksroute.post("/register", async (req: Request, res:any) => {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not defined in environment variables");
    return res.status(500).send("Server configuration error");
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers");
    return res.status(400).send("Error: Missing Svix headers");
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt : any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id as string,
      "svix-timestamp": svix_timestamp as string,
      "svix-signature": svix_signature as string,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).send("Error verifying webhook");
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook received with ID: ${id} and Type: ${eventType}`);
  console.log("Webhook payload:", payload);

  // Handle 'user.created' event
  if (eventType === "user.created") {
    try {
      console.log(evt.data);

      // Create the user in the database (uncomment for Prisma)
      /*
      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id,
          email: primaryEmail.email_address,
          isSubscribed: false, // Default value
        },
      });
      console.log("New user created:", newUser);
      */

      res.status(200).send("User created successfully");
    } catch (error) {
      console.error("Error handling user.created event:", error);
      return res.status(500).send("Error creating user");
    }
  } else {
    res.status(200).send("Event type not handled");
  }
});

export default webhooksroute