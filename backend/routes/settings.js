const express = require("express");
const bodyParser = require("body-parser");
const connection = require("../connection");
const SocialLinks = require("../models/SocialLinks");
var router = express();
router.use(bodyParser.json());


// router.post("/", (req, res) => {
//     try {
//         const { userName, bio, userId } = req.body;
//         const { facebook, twitter, linkedIn , instagram , pinterest } = req.body;

        
//         let updateQuery = 'UPDATE users SET';
//         const queryParams = [];
//         if (userName) {
//             updateQuery += ' username = ?,';
//             queryParams.push(userName);
//         }
//         if (bio) {
//             updateQuery += ' bio = ?,';
//             queryParams.push(bio);
//         }
//         updateQuery = updateQuery.slice(0, -1) + ' WHERE id = ?';
//         queryParams.push(userId);
//         connection.query(updateQuery, queryParams, (error, results) => {
//             if (error) {
//                 console.error("Error updating user profile:", error);
//                 res.status(500).json({ success: false, message: "Failed to update user profile" });
//             } else {
//                 const selectQuery = 'SELECT * FROM users WHERE id = ?';
//                 connection.query(selectQuery, [userId], async (error, results) => {
//                     if (error) {
//                         console.error("Error fetching updated user profile:", error);
//                         res.status(500).json({ success: false, message: "Failed to fetch updated user profile" });
//                     } else {
//                         const userProfile = results[0];

//                          const socialmediaLink = await SocialLinks.findOneAndUpdate(
//                             {userId:results[0].id},
//                             {facebook: facebook},
//                             {instagram:instagram },
//                             {twitter:twitter },
//                             {linkedIn:linkedIn},
//                             {pinterest:pinterest},
//                         );

//                         await socialmediaLink.save();

//                         res.json({ success: true, userProfile });
//                     }
//                 });
//             }
//         });
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         res.status(500).json({ success: false, message: "Failed to update user profile" });
//     }
// });



router.post("/", (req, res) => {
    try {
        const { userName, bio, userId } = req.body;
        console.log("Hellllllllllllllllllllllllllllllllllllll");
        console.log(userId);
        const { socialMediaLinks } = req.body;

        // const { facebook, twitter, linkedIn, instagram, pinterest } = req.body;

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

        // // Handle social media updates
        // if (facebook || twitter || linkedIn || instagram || pinterest) {
        //     updateQuery += ' facebook = ?, twitter = ?, linkedIn = ?, instagram = ?, pinterest = ?,';
        //     queryParams.push(facebook, twitter, linkedIn, instagram, pinterest);
        //     hasUpdates = true;
        // }

        // Remove trailing comma and complete the query
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
                        // Fetch the updated user profile
                        // const userProfile = await getUserProfile(userId);

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
    const social = socialMediaLinks
    try {
        // Find the document in the SocialLinks collection based on the userId
        let socialLinks = await SocialLinks.findOne({ userId });

        // If the document doesn't exist, create a new one
        if (!socialLinks) {
            socialLinks = new SocialLinks({ userId });
        }

        // social.forEach((socialMediaLink, index) => {
        //     if (index === 0 && socialMediaLink.name === 'facebook') {
        //         socialLinks.facebook = socialMediaLink.url;
        //     } else if (index === 1 && socialMediaLink.name === 'twitter') {
        //         socialLinks.twitter = socialMediaLink.url;
        //     } else if (index === 2 && socialMediaLink.name === 'linkedIn') {
        //         socialLinks.linkedIn = socialMediaLink.url;
        //     } else if (index === 3 && socialMediaLink.name === 'instagram') {
        //         socialLinks.instagram = socialMediaLink.url;
        //     } else if (index === 4 && socialMediaLink.name === 'pinterest') {
        //         socialLinks.pinterest = socialMediaLink.url;
        //     }
        //     // Add more conditions as needed based on your socialMediaLinks array structure
        // });

        Object.keys(social.socialMediaLinks).forEach(key => {
            console.log(key);
            if (key === 'facebook') {
                socialLinks.facebook = socialMediaLinks[key].url;
            } else if (key === 'twitter') {
                socialLinks.twitter = socialMediaLinks[key].url;
            } else if (key === 'linkedIn') {
                socialLinks.linkedIn = socialMediaLinks[key].url;
            } else if (key === 'instagram') {
                socialLinks.instagram = socialMediaLinks[key].url;
            } else if (key === 'pinterest') {
                socialLinks.pinterest = socialMediaLinks[key].url;
            }
            // Add more conditions as needed based on your socialMediaLinks object structure
        });


        // Update the social media links in the document
        // if (social.socialMediaLinks[0].name==='facebook') {
        //     socialLinks.facebook = social.socialMediaLinks[0].url;
        // }
        // if (social.socialMediaLinks[1].name==='twitter') {
        //     socialLinks.twitter = social.socialMediaLinks[1].url;
        // }
        // if (social.linkedIn) {
        //     socialLinks.linkedIn = socialMediaLinks.linkedIn;
        // }
        // if (social.instagram) {
        //     socialLinks.instagram = socialMediaLinks.instagram;
        // }
        // if (social.pinterest) {
        //     socialLinks.pinterest = socialMediaLinks.pinterest;
        // }

        // Save the updated document
        await socialLinks.save();
    } catch (error) {
        throw new Error("Failed to update social media links: " + error.message);
    }
}


module.exports = router;