# Put the PunarYard website live (GitHub Pages + one.com domain)

This folder is a plain static website (`index.html`, `styles.css`, `script.js`, `favicon.svg`). It needs no build step and no server, so GitHub Pages can host it for free and serve it on your own domain with HTTPS.

Throughout this guide:

- `punaryard.com` stands for **your domain**. Replace it with the domain you bought on one.com.
- `YOUR-GITHUB-USERNAME` stands for the GitHub account (or organisation) that will own the website repo.

Total time: about 20 minutes of clicking, then up to 24 hours for DNS and the HTTPS certificate to finish.

---

## Step 1: Preview the site on your Mac

```bash
cd /Users/rajankashyap/Documents/personal/github/py-website
python3 -m http.server 8080
```

Open http://localhost:8080 and check the text, phone number and email. Press `Ctrl + C` to stop.

---

## Step 2: Create an empty repo on GitHub

The website has its own folder, `/Users/rajankashyap/Documents/personal/github/py-website`, separate from the `tudaitech` app repo. GitHub Pages on a free plan only works on **public** repos.

1. Go to https://github.com/new.
2. Fill in:
   - **Owner:** your account (or an org such as `tudaitech` or a new `punaryard`)
   - **Repository name:** `py-website` (any name works; use the same name in Step 3)
   - **Visibility:** Public
   - Leave "Add a README", ".gitignore" and "license" **unticked**. The repo must start empty.
3. Click **Create repository**.

---

## Step 3: Push the website to the repo

```bash
cd /Users/rajankashyap/Documents/personal/github/py-website
git init
git add .
git commit -m "PunarYard website"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/py-website.git
git push -u origin main
```

Every push to `main` after this redeploys the site within a minute or two.

---

## Step 4: Turn on GitHub Pages

1. Open the repo on GitHub, then **Settings → Pages** (in the left sidebar under "Code and automation").
2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`, folder `/ (root)`, then **Save**.
3. Wait 1–2 minutes and refresh. GitHub shows: *"Your site is live at https://YOUR-GITHUB-USERNAME.github.io/py-website/"*. Open it and check it works.

The `.nojekyll` file in this folder tells GitHub to serve the files as they are. Don't delete it.

---

## Step 5 (recommended): Verify your domain with GitHub

This stops anyone else from pointing their GitHub site at your domain.

1. On GitHub, click your **profile picture → Settings → Pages** (this is your *account* settings, not the repo's). For an organisation, use **Org → Settings → Pages**.
2. Click **Add a domain**, type `punaryard.com` and click **Add domain**.
3. GitHub shows a **TXT record** like this:
   - Name: `_github-pages-challenge-YOUR-GITHUB-USERNAME`
   - Value: a random code such as `a1b2c3d4e5...`
4. Keep this page open. You'll add that record at one.com in Step 6, then come back and click **Verify**.

---

## Step 6: Point the domain at GitHub (one.com)

1. Log in at https://www.one.com/admin/ (Control Panel).
2. If you have several domains, pick the right one at the top.
3. Go to **Advanced settings → DNS settings** (on some accounts it's under **DNS** in the left menu). You should see the list of **DNS records**.

### 6a. Remove one.com's default website records

one.com points new domains at its own web hosting. Those records will clash with GitHub's.

- Delete any **A** record whose hostname is empty / `@` / `punaryard.com`.
- Delete any **AAAA** record for the same hostname.
- Delete any **A** or **CNAME** record for `www`.
- If **Web forwarding / Domain redirect** is on for this domain, turn it off.

**Don't touch MX, SPF/TXT or `autodiscover` records.** Those handle email. You're using Gmail now, but leave them alone in case you add one.com email later.

### 6b. Add the GitHub records

Click **Create new record** for each row below. Leave the hostname **empty** where it says "(blank)". one.com treats blank as the main domain. TTL: leave the default (3600 is fine).

| Type  | Hostname | Points to / Value |
|-------|----------|-------------------|
| A     | (blank)  | `185.199.108.153` |
| A     | (blank)  | `185.199.109.153` |
| A     | (blank)  | `185.199.110.153` |
| A     | (blank)  | `185.199.111.153` |
| AAAA  | (blank)  | `2606:50c0:8000::153` |
| AAAA  | (blank)  | `2606:50c0:8001::153` |
| AAAA  | (blank)  | `2606:50c0:8002::153` |
| AAAA  | (blank)  | `2606:50c0:8003::153` |
| CNAME | `www`    | `YOUR-GITHUB-USERNAME.github.io` |
| TXT   | `_github-pages-challenge-YOUR-GITHUB-USERNAME` | the code from Step 5 |

Notes:

- The CNAME value is your GitHub username followed by `.github.io`. Don't add the repo name. If one.com asks, you can add a trailing dot (`YOUR-GITHUB-USERNAME.github.io.`), but it's usually not needed.
- The AAAA rows (IPv6) are optional but recommended.
- Save. Changes usually show up in 10–30 minutes, and can take up to 24 hours.

### 6c. Check DNS from your Mac

```bash
dig punaryard.com +short          # should list the four 185.199.x.153 addresses
dig www.punaryard.com +short      # should show YOUR-GITHUB-USERNAME.github.io then the 185.199.x.153 addresses
dig TXT _github-pages-challenge-YOUR-GITHUB-USERNAME.punaryard.com +short
```

If you still see one.com's old IP, wait and try again. One of the old records may also still be there.

Then go back to the GitHub page from Step 5 and click **Verify**.

---

## Step 7: Connect the domain to the repo and turn on HTTPS

1. Repo → **Settings → Pages → Custom domain**: type `punaryard.com` (without `www`) and click **Save**.
   - GitHub runs a DNS check. A green tick means it's done. If it says "DNS check in progress" or shows a warning, wait 10–30 minutes and press **Check again**.
   - GitHub commits a file named `CNAME` to your repo. Run `git pull` locally before your next push so you don't overwrite it.
2. When the certificate is ready (a few minutes to 24 hours after DNS works), tick **Enforce HTTPS**. If it's greyed out, the certificate isn't ready yet. Come back later.
3. Test all four addresses. Each should end up at `https://punaryard.com`:
   - http://punaryard.com
   - https://punaryard.com
   - http://www.punaryard.com
   - https://www.punaryard.com

---

## Step 8: After it's live

- **Google Search:** add the site at https://search.google.com/search-console (Domain property → it gives you another TXT record to add at one.com).
- **Google Business Profile:** create one for PunarYard with the same phone number, and set the service area to your seven states. This is how people searching "building demolition near me" will find you.
- **Editing text:** everything is in `index.html`. Phone, email and the state list also appear in `script.js` (the `PHONE`, `EMAIL` and `SERVED` variables at the top). If you add or remove a state, change both files.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| GitHub shows a 404 on `github.io` | Check Pages is set to branch `main`, folder `/ (root)`, and that `index.html` is at the top level of the repo, not inside a sub-folder. |
| The domain still shows a one.com parking page | An old one.com A record is still there, or DNS hasn't updated yet. Remove the old record and wait. |
| "Domain does not resolve to the GitHub Pages server" | The A records are wrong or missing. Compare with the table in 6b. |
| "Enforce HTTPS" stays greyed out | DNS must be correct first. Then remove the custom domain in Settings → Pages, save, add it again, and wait up to 24 hours. |
| `www` works but the main domain doesn't, or the other way round | One of the record types in 6b is missing. You need both the A records **and** the `www` CNAME. |
| Push rejected after adding the domain | GitHub added a `CNAME` file. Run `git pull --rebase` and push again. |
