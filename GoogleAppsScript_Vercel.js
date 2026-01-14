// ============================================
// GOOGLE APPS SCRIPT FOR GOOGLE FORMS
// WITH VERCEL API
// ============================================

// ====== CONFIGURATION ======
const DISCORD_BOT_URL = 'https://your-project-name.vercel.app'; // Your Vercel URL (no trailing slash)
const API_SECRET = 'YOUR_SECRET_KEY_HERE'; // Must match API_SECRET in Vercel environment variables

// ====== MAIN FUNCTION ======
function onFormSubmit(e) {
  try {
    const form = FormApp.getActiveForm();
    const formTitle = form.getTitle();
    const responses = e.response.getItemResponses();
    
    // Build embed fields from form responses
    const fields = [];
    
    responses.forEach(function(response) {
      const question = response.getItem().getTitle();
      const answer = response.getResponse();
      
      // Convert answer to string, handle arrays
      let answerText = '';
      if (Array.isArray(answer)) {
        answerText = answer.join(', ');
      } else {
        answerText = String(answer);
      }
      
      fields.push({
        name: question,
        value: answerText || 'No response',
        inline: false
      });
    });
    
    // Get submission timestamp
    const timestamp = new Date(e.response.getTimestamp());
    
    // Get respondent email if available
    const respondentEmail = e.response.getRespondentEmail();
    if (respondentEmail) {
      fields.push({
        name: 'Submitted by',
        value: respondentEmail,
        inline: false
      });
    }
    
    // Create embed object
    const embed = {
      title: '📋 ' + formTitle,
      description: 'A new form response has been submitted and requires review.',
      color: 0x0099ff, // Blue color
      fields: fields,
      footer: 'Submitted at ' + timestamp.toLocaleString(),
      timestamp: timestamp.toISOString()
    };
    
    // Send to Vercel API
    const payload = {
      embed: embed
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + API_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(DISCORD_BOT_URL + '/api/form-submission', options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      Logger.log('✅ Successfully sent to Discord via Vercel: ' + response.getContentText());
      const responseData = JSON.parse(response.getContentText());
      Logger.log('Message ID: ' + responseData.messageId);
    } else {
      Logger.log('❌ Error sending to Vercel. Status: ' + responseCode);
      Logger.log('Response: ' + response.getContentText());
    }
    
  } catch (error) {
    Logger.log('❌ Error in onFormSubmit: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
}

// ====== TRIGGER SETUP ======
// Run this function ONCE to set up the form submit trigger
function createFormSubmitTrigger() {
  try {
    const form = FormApp.getActiveForm();
    
    // Delete existing triggers to avoid duplicates
    const triggers = ScriptApp.getUserTriggers(form);
    triggers.forEach(function(trigger) {
      ScriptApp.deleteTrigger(trigger);
    });
    
    // Create new trigger
    ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
    
    Logger.log('✅ Form submit trigger created successfully!');
    Logger.log('The script will now run automatically when someone submits the form.');
    
  } catch (error) {
    Logger.log('❌ Error creating trigger: ' + error.toString());
  }
}

// ====== TEST FUNCTIONS ======
// Test the connection to your Vercel API
function testConnection() {
  try {
    const options = {
      method: 'get',
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(DISCORD_BOT_URL + '/api/health', options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      Logger.log('✅ Vercel API connection successful!');
      Logger.log('Response: ' + response.getContentText());
    } else {
      Logger.log('⚠️ Connection issue. Status: ' + responseCode);
      Logger.log('Response: ' + response.getContentText());
    }
    
  } catch (error) {
    Logger.log('❌ Connection failed: ' + error.toString());
    Logger.log('Make sure your Vercel deployment is complete and the URL is correct.');
  }
}

// Send a test embed to Discord via Vercel
function testFormSubmission() {
  try {
    const testEmbed = {
      title: '🧪 Test Form Submission',
      description: 'This is a test submission to verify the Vercel integration is working.',
      color: 0xffaa00, // Orange color
      fields: [
        {
          name: 'Test Question 1',
          value: 'Test Answer 1',
          inline: false
        },
        {
          name: 'Test Question 2',
          value: 'Test Answer 2',
          inline: false
        },
        {
          name: 'Test Email',
          value: 'test@example.com',
          inline: false
        }
      ],
      footer: 'Test submission from Apps Script via Vercel',
      timestamp: new Date().toISOString()
    };
    
    const payload = {
      embed: testEmbed
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + API_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(DISCORD_BOT_URL + '/api/form-submission', options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      Logger.log('✅ Test submission successful!');
      Logger.log('Response: ' + response.getContentText());
      Logger.log('Check your Discord channel - you should see a test message with Allow/Deny buttons!');
    } else {
      Logger.log('❌ Test submission failed. Status: ' + responseCode);
      Logger.log('Response: ' + response.getContentText());
    }
    
  } catch (error) {
    Logger.log('❌ Test failed: ' + error.toString());
  }
}

// ====== USAGE INSTRUCTIONS ======
/*
VERCEL SETUP STEPS:

1. Deploy to Vercel:
   - Deploy the vercel_setup folder to Vercel
   - Add environment variables in Vercel dashboard

2. Update Configuration Here:
   - Set DISCORD_BOT_URL to your Vercel URL (e.g., 'https://your-project.vercel.app')
   - Set API_SECRET to match the one in Vercel environment variables

3. Set Up Trigger (Run once):
   - Select 'createFormSubmitTrigger' from function dropdown
   - Click 'Run'
   - Authorize when prompted

4. Test Connection (Recommended):
   - Select 'testConnection' from function dropdown
   - Click 'Run'
   - Check logs to verify Vercel is reachable

5. Test Submission (Recommended):
   - Select 'testFormSubmission' from function dropdown
   - Click 'Run'
   - Check your Discord channel for the test message

6. Done!
   - Your form will now automatically send submissions to Discord via Vercel
   - Your main Discord bot must be running to handle button clicks

IMPORTANT: 
- Vercel handles the API (receiving forms)
- Your main Discord bot handles button interactions
- Both must be active for full functionality!
*/
