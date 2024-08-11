export const apiUrl = () => {
  return process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP;
};

export const apiHeader = () => {
  const token = JSON.parse(localStorage.getItem('velvet-token'));
  return {
    'ngrok-skip-browser-warning': '69420',
    walletaddress: token.walletAddress,
    signature: token.signature,
  };
};
