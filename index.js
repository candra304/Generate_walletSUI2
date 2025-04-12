import chalk from 'chalk';
import fs from 'fs';
import readline from 'readline';
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

// Interaktif input jumlah wallet
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question(chalk.cyan('Berapa akun tuyul yg tuan mau 😋 ? '), (input) => {
  const jumlahWallet = parseInt(input);

  if (isNaN(jumlahWallet) || jumlahWallet <= 0) {
    console.log(chalk.red('Input tidak valid. Harus berupa angka lebih dari 0.'));
    rl.close();
    return;
  }

  for (let i = 0; i < jumlahWallet; i++) {
    const wallet = generateWallet();
    simpanKeFile(wallet, i + 1);
  }

  console.log(chalk.green(`Berhasil membuat ${jumlahWallet} akun tuyul. Cek file "wallethasil-sui.txt"`));
  rl.close();
});
  
