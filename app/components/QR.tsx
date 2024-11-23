import QRCode from 'react-qr-code'

const Output = ({ token }: { token: string | null }) => {
  
  if (token != null) {
    return (
      <div className="w-fit bg-white border h-fit rounded-md text-base lg:text-lg p-8 flex justify-center items-center flex-col" >
        <QRCode value={token} />
        <p className="mt-8 text-3xl font-bold p-3 bg-indigo-500 text-white rounded-lg">{token}</p>
      </div>
    )
  } else {
    return(<p>Failed to generate QR..</p>)
  }
}

export default Output