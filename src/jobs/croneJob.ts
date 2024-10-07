import cron from 'node-cron';
import OtpModel  from '../framework/models/OtpModel'; 
import { Op } from 'sequelize'; 

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const expirationTime = new Date(now.getTime() - 3 * 60 * 1000);

    try {
        const result = await OtpModel.destroy({
            where: {
                expiresAt: {
                    [Op.lt]: expirationTime, 
                },
            },
        });
        // console.log(`Deleted ${result} expired OTP(s).`);
    } catch (error) {
        console.error('Error deleting expired OTPs:', error);
    }
});

// console.log('Scheduled job to delete expired OTPs every minute.');
