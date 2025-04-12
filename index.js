import chalk from 'chalk';
import fs from 'fs';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Ed25519Keypair } from '@mysten/sui.js';

// Banner
function showBanner() {
  console.clear();
  console.log(`
${chalk.white('========================================')}
${chalk.magentaBright('  █████╗ ██╗   ██╗████████╗ ██████╗ ')}
${chalk.cyanBright(' ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗')}
${chalk.yellowBright(' ███████║██║   ██║   ██║   ██║   ██║')}
${chalk.magentaBright(' ██╔══██║██║   ██║   ██║   ██║   ██║')}
${chalk.cyanBright(' ██║  ██║╚██████╔╝   ██║   ╚██████╔╝')}
${chalk.yellowBright(' ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ')}
${chalk.white('SAT SET')}
${chalk.white('                           [by Chandra]')}
${chalk.white('========================================')}
`);
}

function generateWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const path = "m/44'/784'/0'/0'/0'";
  const derived = derivePath(path, seed.toString('hex'));
  const keypair = Ed25519Keypair.fromSecretKey(derived.key);

  return {
    address: keypair.getPublicKey().toSuiAddress(),
    privateKey: keypair.export().privateKey,
    publicKey: keypair.getPublicKey().toBase64(),
    mnemonic: mnemonic,
  };
}

function simpanKeFile(wallet, index = 1) {
  const isi = `
=== Wallet SUI #${index} ===
Address    : ${wallet.address}
Public Key : ${wallet.publicKey}
Private Key: ${wallet.privateKey}
Mnemonic   : ${wallet.mnemonic}
-------------------------------
`;

  fs.appendFileSync('wallethasil-sui.txt', isi);
}

// Menampilkan banner
showBanner();

// Ganti jumlahWallet sesuai kebutuhan
const jumlahWallet = 50;

for (let i = 0; i < jumlahWallet; i++) {
  const wallet = generateWallet();
  simpanKeFile(wallet, i + 1);
}

console.log(chalk.green(`Berhasil membuat ${jumlahWallet} wallet. Cek file "wallethasil-sui.txt"`));
