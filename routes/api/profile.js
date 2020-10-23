const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
mongoose.set("useFindAndModify", false);
//Load Person model
const Person = require("../../models/Person");

//Load Profile model
const Profile = require("../../models/Profile");

//@type     GET
//@route    /api/profile
//@desc     route for individual user profile
//@access   PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404).json({ proflienotfound: "No Profile found" });
        } else {
          res.json(profile);
        }
      })
      .catch((err) => console.log("Error in profile section" + err));
  }
);

//@type     POST
//@route    /api/profile
//@desc     route for updating/saving individual user profile
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.programingLang !== undefined) {
      profileValues.programingLang = req.body.programingLang.split(",");
    }
    //getting social links
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.instagram) profileValues.social.instagram = req.body.instagram;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;

    //Database stuff below
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileValues },
            { new: true }
          )
            .then((profile) => {
              res.json(profile);
            })
            .catch((err) => console.log(`Problem in updating ${err}`));
        } else {
          Profile.findOne({ username: profileValues.username })
            .then((profile) => {
              //Username already exist
              if (profile) {
                res.status(400).json({ username: "username already in use" });
              }
              //Save user
              new Profile(profileValues)
                .save()
                .then((profile) => res.json(profile))
                .catch((err) => console.log("Cannot save user " + err));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(`Problem in fetching profile ${err}`));
  }
);

//@type     GET
//@route    /api/profile/:username
//@desc     route for getting user profile based on USERNAME
//@access   PUBLIC
router.get("/:username", (req, res) => {
  Profile.findOne({ username: req.params.username })
    .populate("user", ["name", "profilepic"])
    .then((profile) => {
      if (!profile) {
        res.status(404).json({ usernotfound: "User not found" });
      }
      res.json(profile);
    })
    .catch((err) => console.log(`Error in fetching username ${err}`));
});

//@type     GET
//@route    /api/profile/find/alluser
//@desc     route for getting user profile of all user
//@access   PUBLIC
router.get("/find/alluser", (req, res) => {
  Profile.find()
    .populate("user", ["name", "profilepic"])
    .then((profiles) => {
      if (!profiles) {
        res.status(404).json({ usernotfound: "No profile found" });
      }
      res.json(profiles);
    })
    .catch((err) => console.log(`Error in fetching username ${err}`));
});

//@type     GET
//@route    /api/profile/:id
//@desc     route for getting user profile based on USERNAME
//@access   PUBLIC
router.get("/:id", (req, res) => {
  Profile.findOne({ id: req.params.id })
    .populate("user", ["name", "profilepic"])
    .then((proflie) => {
      if (!proflie) res.status(404).json({ userID: "User ID not found" });
      res.json(profile);
    })
    .catch((err) => console.log(`Unable to fetch user with the id ${err}`));
});

//@type     DELETE
//@route    /api/profile
//@desc     routh for deleting users based on ID
//@access   PRIVATE

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id });
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        Person.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: "delete was successfull" }))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//@type     POST
//@route    /api/profile/workrole
//@desc     route for adding work role on user profile
//@access   PRIVATE
router.post(
  "/workrole",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile)
          res.status(404).json({ workrole: "updatation failed for workrole" });
        const newWork = {
          role: req.body.role,
          company: req.body.company,
          country: req.body.country,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          details: req.body.details,
        };
        profile.workrole.push(newWork);
        profile
          .save()
          .then((profile = res.json(profile)))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }
);

//@type     DELETE
//@route    /api/profile/workrole/:w_id
//@desc     routh for deleting specific workrole
//@access   PRIVATE

router.delete(
  "/workrole/:w_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (!profile) res.status(404).json({ failed: "Deletion failed" });
      const removethis = profile.workrole
        .map((item) => item.id)
        .indexOf(req.params.w_id);
      profile.workrole.splice(removethis, 1);
      profile
        .save()
        .then((profile) => res.json(profile))
        .catch((err) => console.log(err));
    });
  }
);

module.exports = router;
