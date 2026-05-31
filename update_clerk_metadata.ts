import { config } from 'dotenv';
config();

async function main() {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) throw new Error('CLERK_SECRET_KEY is missing');

  const userId = 'user_3EV5JMmeYQEEf0uoH2nrA4yQ4sD';

  console.log('Updating Clerk metadata for', userId);

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_metadata: {
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to update Clerk metadata:', res.status, err);
  } else {
    const data = await res.json();
    console.log('Successfully updated Clerk metadata!', data.public_metadata);
  }
}

main().catch(console.error);
