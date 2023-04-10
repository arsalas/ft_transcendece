import { authenticator } from 'otplib'
import qrcode from 'qrcode'
import crypto from 'crypto'

try {

	// crypto.randomBytes(127, (err, buf) => {
	// 	if (err) {
	// 		// Prints error
	// 		console.log(err);
	// 		return;
	// 	}
	// 	console.log(buf.toString('hex'))

	// });
	// const secret = authenticator.generate('6c2ddf5a2fcd552ddcd721e7ee16abb5cc0dd8c7ec4b0130ca119822b8391fe4cc47a135e4b096ecfb5e5595d493d8ff00d546f966d13510e0b65078a861e423828d19f08a4281ca3811111a44773c78df6e3838b547996c359bad922cd0d9e766c153aecdc6a51637b05f61dbc2151a9f9488b3e4865a31a4db881d87006c');
	// console.log({ secret })

	const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';

	const generateQRCode = (user, secret) => {

		const otp = authenticator.keyuri(user, "Our TFA App", secret);
		let imagePath = '';

		qrcode.toDataURL(otp, (err, imageUrl) => {
			if (err) {
				console.log('Could not generate QR code', err);
				return;
			}
			imagePath = imageUrl;
			console.log(imagePath)
		});
		return imagePath;

	}

	// generateQRCode(1, secret);

	const res = authenticator.verify({secret, token:"882563"})
	console.log({res});
} catch (error) {
	console.log(error)
}