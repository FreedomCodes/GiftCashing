const   CronJob = require('cron').CronJob,
        mailService = require('./email');



module.exports.runJobs = function() {

    /**
     * giftStatusIsReview
     */
    new CronJob({
        /**
         * Runs every day
         * at 08:00:00 AM.
         */
        cronTime: '00 00 08 * * *',
        onTick: function() {

            // TODO: Repleace this with query data set fo giftStatusIsReview
            let users = [{
                firstName: 'Isaac',
                lastName: 'Peraza',
                username : 'isaac.peraza@gmail.com',
                password: '1234567890'
            }];

            users.forEach(function(user) {
                mailService.giftStatusIsReview(user);
            })
        },
        start: true,
        timeZone: 'UTC'
    });
    

    /**
     * giftStatusIsPaid
     */
    new CronJob({
        /**
         * Runs every day
         * at 08:00:00 AM.
         */
        cronTime: '00 00 08 * * *',
        onTick: function() {

            // TODO: Repleace this with query data set fo giftStatusIsPaid
            let users = [{
                firstName: 'Isaac',
                lastName: 'Peraza',
                username : 'isaac.peraza@gmail.com',
                password: '1234567890'
            }];

            users.forEach(function(user) {
                mailService.giftStatusIsPaid(user);
            })
        },
        start: true,
        timeZone: 'UTC'
    });


    /**
     * giftStatusIsReviewOverSevenDays
     */
    new CronJob({
        /**
         * Runs every day
         * at 08:00:00 AM.
         */
        cronTime: '00 00 08 * * *',
        onTick: function() {

            // TODO: Repleace this with query data set fo giftStatusIsReviewOverSevenDays
            let users = [{
                firstName: 'Isaac',
                lastName: 'Peraza',
                username : 'isaac.peraza@gmail.com',
                password: '1234567890'
            }];

            users.forEach(function(user) {
                mailService.giftStatusIsReviewOverSevenDays(user);
            })
        },
        start: true,
        timeZone: 'UTC'
    });
};
