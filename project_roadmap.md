# Project goal
To build an automatic traigers or incoming tasks and to sort these into different spheres; personal, work
and the into sub categories; todo, toRead, toWatch, forLater, 

# approach

1. build triage according to type of info and in this order:
    1. text
        1. hashtags
        2. keywords (to be included in system to make easier triager)
        3. context search
    1. Webpage / URL
        1. Analyzer webpage content > triager service
        2. Make entry in correct context
    2. file
        1. image
        2. audio
        3. video
        4. text
        5. pdf

# Assumptions in building the app
- Use AI for most things, it will cost, but rather good AI, than mediocre static code that wont perform. This will be cutting edge.


# 250204
- build a function that takes a string and searches it for keywords. 
- Keywords are stored in a constants-file
- Keywords are todo, köp, 
- If match on keyword, then that will be the category
- then we refactor to update the categories
- do we need to normalise words in the
- change dueDate to []? As to have start and end and recurring dates?

## Flow
- Check keywords -> Category 
    - if Category -> don't AI-check category
- Check NER
- IF no Category: AI-category checker

## Category structure
The best approach would be to have a category structure of similar structure as a base and then decide if the task at hand is either personal or work related
s

# Features 

Will have several channels of input; SMS; imessage, WA, email, slack etc.

Will prompt for initial context creatation

Will show recent sorted items for checking if triage is correct

Will check source type and initial triage will be based on where its from; 
personal phone, email etc will be assumed private

Connect to sql db

Use a code structure/instructions for the AI according to: https://x.com/cj_zZZz/status/1871595891016020098

System will ask back for provided info if relevant, if they should summarize, clean etc? For example sending an article will save 
the time, date, URL and also if wanted an AI summary if the article or info provided.

# Design questions

How to create categories? And what to name them?
Personal, work, ...?
todo, toRead, 

# Key Topics to Sort Under
Priority Level: Urgent, High, Medium, Low
Time Frame: Daily, Weekly, Monthly, Long-term
Context: Work, Personal, Hybrid
Theme: Health, Finance, Education, Social, etc.
Goal Type: Task (short-term), Project (multi-step), or Habit (repetitive)

# Tools
https://app.codeguide.dev/pricing

# DB solutions
Db playground
https://myscale.com/blog/myscale-sql-vector-playground/

# Embeddings
https://cybernetist.com/2024/01/07/fun-with-embeddings/
https://supabase.com/blog/openai-embeddings-postgres-vector
https://github.com/openai/openai-cookbook/blob/main/examples/Semantic_text_search_using_embeddings.ipynb

# Database
https://supabase.com/dashboard/new/oumbsihhzlkbmkwtuhpl?projectName=121Development%27s%20Project
Gathr
Github login

# Webscrape
https://www.firecrawl.dev 
    --github login

## webscrape backups
https://github.com/browser-use/browser-use
https://app.zenrows.com/plans
