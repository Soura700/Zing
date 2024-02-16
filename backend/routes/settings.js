const express = require("express");
const bodyParser = require("body-parser");
const connection = require("../connection");
const SocialLinks = require("../models/SocialLinks");
var router = express();
router.use(bodyParser.json());


router.post("/", (req, res) => {
    try {
        const { userName, bio, userId } = req.body;
        const { socialMediaLinks } = req.body;
        let updateQuery = 'UPDATE users SET';
        const queryParams = [];
        // Check if any fields other than userId are provided in the request body
        let hasUpdates = false;
        // Dynamically construct the query based on provided fields
        if (userName) {
            updateQuery += ' username = ?,';
            queryParams.push(userName);
            hasUpdates = true;
        }
        if (bio) {
            updateQuery += ' bio = ?,';
            queryParams.push(bio);
            hasUpdates = true;
        }
        if (hasUpdates) {
            updateQuery = updateQuery.slice(0, -1) + ' WHERE id = ?';
            queryParams.push(userId);

            // Execute the update query
            connection.query(updateQuery, queryParams, async (error, results) => {
                if (error) {
                    console.error("Error updating user profile:", error);
                    res.status(500).json({ success: false, message: "Failed to update user profile" });
                } else {
                    try {
                        // Update the social media links in the MongoDB
                        await updateSocialMediaLinks(userId, {  socialMediaLinks                      // await updateSocialMediaLinks(userId, { facebook, twitter, linkedIn, instagram, pinterest });
                        });
                        
                        // await updateSocialMediaLinks(userId, { facebook, twitter, linkedIn, instagram, pinterest });

                        res.json({ success: true });
                    } catch (error) {
                        console.error("Error fetching updated user profile or updating social media links:", error);
                        res.status(500).json({ success: false, message: "Failed to fetch updated user profile or update social media links" });
                    }
                }
            });
        } else {
            // No updates provided
            res.status(400).json({ success: false, message: "No updates provided" });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ success: false, message: "Failed to update user profile" });
    }
});


async function updateSocialMediaLinks(userId, socialMediaLinks) {
    try {
        let socialLinks = await SocialLinks.findOne({ userId });

        if (!socialLinks) {
            socialLinks = new SocialLinks({ userId });
        }
        Object.entries(socialMediaLinks).forEach(([index, urlsArray]) => {
            console.log("Index:", index);
            urlsArray.forEach((urlObj, urlIndex) => {
                console.log("URL " + urlIndex + ":", urlObj.url);
                if (socialLinks.schema.paths[urlObj.name]) {
                    console.log("Entered");
                    const sitename = urlObj.name;
                    socialLinks[sitename] = urlObj.url;
                }
            });
        });
        await socialLinks.save();
    } catch (error) {
        throw new Error("Failed to update social media links: " + error.message);
    }
}


router.get('/social-links/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      // Query the database to find the profile data for the given userId
      const profile = await SocialLinks.findOne({ userId });
  
      if (!profile) {
        // If no profile data found, return null
        return res.json({ facebook: null, twitter: null, instagram : null, linkedIn :null , other: null });
      }
  
      // If profile data found, return the social media links
      res.json({
        facebook: profile.facebook || null,
        twitter: profile.twitter || null,
        linkedIn:profile.link || null,
        instagram: profile.instagram || null,
        pinterest: profile.pinterest || null,

        // other: profile.other || null
      });
    } catch (error) {
      console.error('Error checking social links:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;