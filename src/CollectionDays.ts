import * as spu from 'spu-api';

export function getCollectionDaysAsync(address: string): Promise<spu.ICollectionDay[]> {
    return new Promise(
        (resolve, reject) => {
            spu.getCollectionDays(
                address,
                (err, days) => {
                    if (err) {
                        return reject(err);
                    };

                    resolve(days);
                });
        });
}

export function getNextCollectionDay(days: spu.ICollectionDay[]): spu.ICollectionDay {
    const sortedDays = [...days].sort((a, b) => a.date.valueOf() - b.date.valueOf()); 
                
    const now = new Date();

    const futureDays = sortedDays.filter(day => day.date.valueOf() >= now.valueOf());

    if (futureDays.length) {
        return futureDays[0];
    }

    return undefined;
}
