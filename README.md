# Togedule: Adaptive Representation of Group Availability Using Large Language Models for Scheduling Meetings

![How Togedule adjusts the pool of choices based on prior inputs](https://github.com/jyoonsong/togedule/assets/17509651/13515d7e-24ca-4079-8a6e-94fb2a08281f)

This repository accompanies our research paper titled ["Togedule: Adaptive Representation of Group Availability Using Large Language Models for Scheduling Meetings."]()

## What is Togedule?

Togedule is a dynamic scheduling tool, which refers to a voting mechanism that updates the set of choices to be shown and the format in which they are presented based on the inputs of attendees. For attendees, by switching between poll and calendar views depending on the number of promising candidates, Togedule leverages the pros and cons of each format. We used GPT-4 to keep the adaptation flexible and deal with various circumstances. For organizers, Togedule provides recommendations on which times to accept as the final meeting time taking into account the priority and preference of each attendee.

## Directory structure

The `client` and `server` directories contain the code for the Togedule system. The `data` directory contains the anonymized data we collected from the two controlled experiments that evaluate the Togedule system.
Details are provided in the paper above. 
Below, we document the steps for setting up and running Togedule on your local machine.

Alternatively, you can try out [our live demo](https://togedule.vercel.app).

## Running Togedule locally

### Step 1. Clone the repository

### Step 2. Set up environment variables
Create a `.env` file at the root of the repository. The `.env.example` file contains the example of what the dotenv file should look like.

### Step 3. Create a MongoDB cluster 
Set `MONGO_URL` and `DB_NAME`

### Step 4. Get OPEN AI API keys
Set `OPENAI_ORG_ID` and `OPENAI_API_KEY`

### Step 5. Run the server and client
Run `npm install && npm run dev` on your terminal

## Authors and Citation
Authors: Jaeyoon Song, Zahra Ashktorab, and Thomas W. Malone

Please cite our paper if you use the code or data in this repository.
```latex
@inproceedings{Song2025Togedule,  
  author = {Song, Jaeyoon and Ashktorab, Zahra and Malone, Thomas W.},  
  title = {Togedule: Adaptive Representation of Group Availability Using Large Language Models for Scheduling Meetings},  
  year = {2025},  
  publisher = {Association for Computing Machinery},  
  address = {New York, NY, USA},  
  booktitle = {In the 36th Annual ACM Symposium on User Interface Software and Technology (UIST '23)},  
  keywords = {Human-AI interaction, agents, generative AI, large language models},  
  location = {San Francisco, CA, USA},  
  series = {CSCW '25}
}
```

