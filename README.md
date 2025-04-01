# Togedule: Scheduling Meetings with Large Language Models and Adaptive Representations of Group Availability

![How Togedule adjusts the pool of choices based on prior inputs](https://github.com/jyoonsong/togedule/assets/17509651/13515d7e-24ca-4079-8a6e-94fb2a08281f)

This repository accompanies our research paper titled ["Togedule: Scheduling Meetings with Large Language Models and Adaptive Representations of Group Availability."]()

## About Togedule

Togedule is a dynamic scheduling tool, which refers to a voting mechanism that updates the set of choices to be shown and the format in which they are presented based on the inputs of attendees. For attendees, by switching between poll and calendar views depending on the number of promising candidates, Togedule leverages the pros and cons of each format. We used GPT-4 to keep the adaptation flexible and deal with various circumstances. For organizers, Togedule provides recommendations on which times to accept as the final meeting time taking into account the priority and preference of each attendee.

## Directory Structure

The `data` directory contains the anonymized data we collected from the two controlled experiments that evaluate the Togedule system.
Details are provided in the paper above.

The `client` and `server` directories contain the code for the Togedule system.
Below, we document the steps for setting up and running Togedule on your local machine.

## Running an instance locally

### Step 1. Clone the repository

Run `git clone` in your terminal.

### Step 2. Set up environment variables

Create a `.env` file at the root. The `.env.example` file contains the example of what the dotenv file should look like.

### Step 3. Create a MongoDB cluster

Go to [the MongoDB website](https://mongodb.com/) and create a cluster.
Set `MONGO_URL` that starts with `mongodb+srv://`. Set the name of the database as `DB_NAME`.

### Step 4. Get OPEN AI API keys

Go to [the Open AI website](https://platform.openai.com/api-keys) and create an API key.
Set the organization ID as `OPENAI_ORG_ID` and the API key as `OPENAI_API_KEY`. In the case of `OPENAI_OWNER`, it should be `admin` when you want to use your own API keys and `user` when you want users to use their API keys.

### Step 5. Run the server and client

Run `npm install` and `npm run dev` in your terminal. The recommended node version is 16.

## Authors and Citation

Authors: Jaeyoon Song, Zahra Ashktorab, and Thomas W. Malone

Please cite our paper if you use the code or data in this repository.

```latex
@inproceedings{Song2025Togedule,
  title = {Togedule: Scheduling Meetings with Large Language Models and Adaptive Representations of Group Availability},
  author = {Song, Jaeyoon and Ashktorab, Zahra and Malone, Thomas W.},
  journal={Proceedings of the ACM on Human-Computer Interaction},
  year = {2025},
  publisher = {Association for Computing Machinery},
  keywords = {Human-AI Interaction, Scheduling, Large Language Models},
  series = {CSCW '25}
}
```
