# Deploy PunarYard website: GitHub Pages + one.com

Replace `YOUR-GITHUB-USERNAME` with your GitHub username and `punaryard.com` with your one.com domain.

## A. GitHub

1. Go to https://github.com/new and create a repo:
   - Name: `py-website`
   - Visibility: **Public** (free GitHub Pages needs a public repo)
   - Leave README, .gitignore and licence **unticked**
2. Push this folder to the repo:
   ```bash
   cd /Users/rajankashyap/Documents/personal/github/py-website
   git init
   git add .
   git commit -m "PunarYard website"
   git branch -M main
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/py-website.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**.
4. Wait 1–2 minutes, then open `https://YOUR-GITHUB-USERNAME.github.io/py-website/` to check that the site loads.
5. (Recommended) Verify the domain: **profile picture → Settings → Pages → Add a domain** → enter `punaryard.com`. GitHub shows a TXT record (name `_github-pages-challenge-YOUR-GITHUB-USERNAME` and a code). Add that record at one.com in step B4, then come back and click **Verify**.

## B. one.com

1. Log in at https://www.one.com/admin/ and select your domain.
2. Open **Advanced settings → DNS settings → DNS records**.
3. Delete one.com's default website records:
   - **A** and **AAAA** records with a blank / `@` hostname
   - any **A** or **CNAME** record for `www`
   - turn off **Web forwarding** if it's on
   - **Leave MX, SPF and other email records alone.**
4. Add these records (**Create new record**; leave the hostname blank where shown; default TTL is fine):

   | Type  | Hostname | Value |
   |-------|----------|-------|
   | A     | (blank)  | `185.199.108.153` |
   | A     | (blank)  | `185.199.109.153` |
   | A     | (blank)  | `185.199.110.153` |
   | A     | (blank)  | `185.199.111.153` |
   | AAAA  | (blank)  | `2606:50c0:8000::153` |
   | AAAA  | (blank)  | `2606:50c0:8001::153` |
   | AAAA  | (blank)  | `2606:50c0:8002::153` |
   | AAAA  | (blank)  | `2606:50c0:8003::153` |
   | CNAME | `www`    | `YOUR-GITHUB-USERNAME.github.io` |
   | TXT   | `_github-pages-challenge-YOUR-GITHUB-USERNAME` | code from step A5 |

5. Save. DNS usually updates within 10–30 minutes, but it can take up to 24 hours. Check it from Terminal:
   ```bash
   dig punaryard.com +short        # should show the four 185.199.x.153 addresses
   dig www.punaryard.com +short    # should show YOUR-GITHUB-USERNAME.github.io
   ```

## C. Connect the domain on GitHub

1. Repo → **Settings → Pages → Custom domain** → enter `punaryard.com` → **Save**. Wait for the green "DNS check successful".
2. Tick **Enforce HTTPS**. If the box is greyed out, the certificate isn't ready yet. Try again in a few hours.
3. GitHub adds a `CNAME` file to the repo. Run `git pull` before your next push.
4. Check that `punaryard.com` and `www.punaryard.com` both open the site with `https://`.

## D. Updating the site later

```bash
cd /Users/rajankashyap/Documents/personal/github/py-website
git add .
git commit -m "Update website"
git push
```

The live site updates within 1–2 minutes.

## If something goes wrong

- **one.com parking page still shows:** an old A record is still there, or DNS hasn't updated yet. Delete the old record and wait.
- **GitHub 404:** check that Pages is set to `main` and `/ (root)`.
- **HTTPS greyed out for more than 24 hours:** remove the custom domain in Settings → Pages, save, then add it again.
- **Push rejected:** run `git pull --rebase`, then `git push`.
