export default (subject: any, key: string) : boolean => (
    subject != null &&
    (
        subject[key] === undefined ||
        subject[key] === true ||
        subject[key] === false
    )
);