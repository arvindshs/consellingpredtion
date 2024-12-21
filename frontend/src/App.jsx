import { useForm } from 'react-hook-form';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const { register, handleSubmit, formState: { errors,isSubmitting }, reset } = useForm();
  const [clgList, setClgList] = useState([])
  const [resultState , setResultState] = useState("Please enter the credentials...")
  async function onsubmit(data) {
    const std_data = {
      cutoff: Number(data.cutoff),
      community: data.community,
      department: data.coures
    }
    const serverResponse = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(std_data)
    })
    const jdata = await serverResponse.json()
    if (!jdata.errorsts) {
      setClgList(jdata.colleges)
      window.scrollTo({
        top: 650,
        left: 0,
        behavior: 'smooth',
      });
      setResultState("No colleges match your requirements...")
    }else{
 
      setResultState("No colleges match your requirements...")
      window.scrollTo({
        top: 650,
        left: 0,
        behavior: 'smooth',
      });
    }

     reset({ cutoff: '', community: '', coures: '' });


  }

  useEffect(()=>{
    console.clear()
  })
  return (

    <div>
      <nav>
        <p className='nav'>Engineering Counselling Prediction</p>
      </nav>
      <div className='cointainer' id='home'>

        <form onSubmit={handleSubmit(onsubmit)}>


          <label className='label'>Enter Your Cutoff Marks</label>
          <input type="text" placeholder='Enter your Cutoff' {...register("cutoff", { required: { value: true, message: "required cutoff mark" },max:{value :200 ,message:"cutoff should be less than 200"},min:{value:70,message:"cutoff should be more than 70"} })} />
          <div className="err-f">
            {errors.cutoff && <p className='error-msg'>{errors.cutoff.message}</p>}
          </div>


          <label className='label'>Select Your Coummunity</label>
          <select {...register("community", { required: { value: true, message: "required community" } })}>
            <option value="" disabled selected hidden>Select an option...</option>
            <option value="OC">OC</option>
            <option value="BC">BC</option>
            <option value="BCM">BCM</option>
            <option value="MBC">MBC</option>
            <option value="SC">SC</option>
            <option value="SCA">SCA</option>
            <option value="ST">ST</option>

          </select>
          <div className="err-f">
            {errors.community && <p className='error-msg'>{errors.community.message}</p>}
          </div>
          <label className='label'>Select your Course</label>
          <select className='select'{...register("coures", { required: { value: true, message: "required coures title" } })}>
            <option className='placeholder' value="" disabled selected hidden>Select an option...</option>
            <option value="AERONAUTICAL ENGINEERING">AERONAUTICAL ENGINEERING</option>
            <option value="AEROSPACE ENGINEERING">AEROSPACE ENGINEERING</option>
            <option value="AGRICULTURAL ENGINEERING">AGRICULTURAL ENGINEERING</option>
            <option value="ARTIFICIAL INTELLIGENCE AND DATA SCIENCE">ARTIFICIAL INTELLIGENCE AND DATA SCIENCE</option>
            <option value="ARTIFICIAL INTELLIGENCE AND DATA SCIENCE (SS)">ARTIFICIAL INTELLIGENCE AND DATA SCIENCE (SS)</option>
            <option value="AUTOMOBILE ENGINEERING">AUTOMOBILE ENGINEERING</option>
            <option value="AUTOMOBILE ENGINEERING (SS)">AUTOMOBILE ENGINEERING (SS)</option>
            <option value="ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING">Artificial Intelligence and Machine Learning</option>
            <option value="BIO MEDICAL ENGINEERING">BIO MEDICAL ENGINEERING</option>
            <option value="BIO MEDICAL ENGINEERING (SS)">BIO MEDICAL ENGINEERING (SS)</option>
            <option value="BIO TECHNOLOGY">BIO TECHNOLOGY</option>
            <option value="BIO TECHNOLOGY (SS)">BIO TECHNOLOGY (SS)</option>
            <option value="BIO TECHNOLOGY AND BIO CHEMICAL ENGINEERING">Bio Technology and Bio Chemical Engineering</option>
            <option value="CHEMICAL ENGINEERING">CHEMICAL ENGINEERING</option>
            <option value="CHEMICAL ENGINEERING (SS)">CHEMICAL ENGINEERING (SS)</option>
            <option value="CIVIL ENGINEERING">CIVIL ENGINEERING</option>
            <option value="CIVIL ENGINEERING (SS)">CIVIL ENGINEERING (SS)</option>
            <option value="COMPUTER AND COMMUNICATION ENGINEERING">COMPUTER AND COMMUNICATION ENGINEERING</option>
            <option value="COMPUTER SCIENCE AND BUSSINESS SYSTEM">COMPUTER SCIENCE AND BUSSINESS SYSTEM</option>
            <option value="COMPUTER SCIENCE AND DESIGN">COMPUTER SCIENCE AND DESIGN</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING">COMPUTER SCIENCE AND ENGINEERING</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)">COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (SS)">COMPUTER SCIENCE AND ENGINEERING (SS)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (TAMIL)">COMPUTER SCIENCE AND ENGINEERING (TAMIL)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING) (SS)">Computer Science and Engineering (Artificial Intelligence and Machine Learning) (SS)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)">Computer Science and Engineering (Cyber Security)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (INTERNET OF THINGS AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)">Computer Science and Engineering (Internet of Things and Cyber Security including Block Chain Technology)</option>
            <option value="COMPUTER SCIENCE AND ENGINEERING (INTERNET OF THINGS)">Computer Science and Engineering (Internet of Things)</option>
            <option value="COMPUTER SCIENCE AND TECHNOLOGY">Computer Science and Technology</option>
            <option value="ELECTRICAL AND ELECTRONICS (SANDWICH) (SS)">ELECTRICAL AND ELECTRONICS (SANDWICH) (SS)</option>
            <option value="ELECTRICAL AND ELECTRONICS ENGINEERING">ELECTRICAL AND ELECTRONICS ENGINEERING</option>
            <option value="ELECTRICAL AND ELECTRONICS ENGINEERING (SS)">ELECTRICAL AND ELECTRONICS ENGINEERING (SS)</option>
            <option value="ELECTRONICS AND COMMUNICATION ENGINEERING">ELECTRONICS AND COMMUNICATION ENGINEERING</option>
            <option value="ELECTRONICS AND COMMUNICATION ENGINEERING (SS)">ELECTRONICS AND COMMUNICATION ENGINEERING (SS)</option>
            <option value="ELECTRONICS AND INSTRUMENTATION ENGINEERING">ELECTRONICS AND INSTRUMENTATION ENGINEERING</option>
            <option value="ELECTRONICS AND TELECOMMUNICATION ENGINEERING">ELECTRONICS AND TELECOMMUNICATION ENGINEERING</option>
            <option value="FASHION TECHNOLOGY">FASHION TECHNOLOGY</option>
            <option value="FASHION TECHNOLOGY (SS)">FASHION TECHNOLOGY (SS)</option>
            <option value="FOOD TECHNOLOGY">FOOD TECHNOLOGY</option>
            <option value="INDUSTRIAL BIO TECHNOLOGY">INDUSTRIAL BIO TECHNOLOGY</option>
            <option value="INFORMATION TECHNOLOGY">INFORMATION TECHNOLOGY</option>
            <option value="INFORMATION TECHNOLOGY (SS)">INFORMATION TECHNOLOGY (SS)</option>
            <option value="INSTRUMENTATION AND CONTROL ENGINEERING">INSTRUMENTATION AND CONTROL ENGINEERING</option>
            <option value="INSTRUMENTATION AND CONTROL ENGINEERING (SS)">INSTRUMENTATION AND CONTROL ENGINEERING (SS)</option>
            <option value="M TECH COMPUTER SCIENCE AND ENGINEERING (INTEGRATED 5 YEARS)">M.Tech. Computer Science and Engineering (Integrated 5 years)</option>
            <option value="MECHANICAL ENGINEERING">MECHANICAL ENGINEERING</option>
            <option value="MECHANICAL ENGINEERING (SANDWICH) (SS)">MECHANICAL ENGINEERING (SANDWICH) (SS)</option>
            <option value="MECHANICAL ENGINEERING (SS)">MECHANICAL ENGINEERING (SS)</option>
            <option value="METALLURGICAL ENGINEERING">METALLURGICAL ENGINEERING</option>
            <option value="METALLURGICAL ENGINEERING (SS)">METALLURGICAL ENGINEERING (SS)</option>
            <option value="MECHANICAL AND MECHATRONICS ENGINEERING (ADDITIVE MANUFACTURING)">Mechanical and Mechatronics Engineering (Additive Manufacturing)</option>
            <option value="MECHATRONICS ENGINEERING">Mechatronics Engineering</option>
            <option value="PETRO CHEMICAL ENGINEERING">PETRO CHEMICAL ENGINEERING</option>
            <option value="PETROLEUM ENGINEERING">PETROLEUM ENGINEERING</option>
            <option value="PHARMACEUTICAL TECHNOLOGY">PHARMACEUTICAL TECHNOLOGY</option>
            <option value="PRODUCTION ENGINEERING">PRODUCTION ENGINEERING</option>
            <option value="PRODUCTION ENGINEERING (SANDWICH) (SS)">PRODUCTION ENGINEERING (SANDWICH) (SS)</option>
            <option value="PRODUCTION ENGINEERING (SS)">PRODUCTION ENGINEERING (SS)</option>
            <option value="ROBOTICS AND AUTOMATION">ROBOTICS AND AUTOMATION</option>
            <option value="ROBOTICS AND AUTOMATION (SS)">ROBOTICS AND AUTOMATION (SS)</option>
            <option value="TEXTILE TECHNOLOGY">TEXTILE TECHNOLOGY</option>
            <option value="TEXTILE TECHNOLOGY (SS)">TEXTILE TECHNOLOGY (SS)</option>

          </select>
          <div className="err-f">
            {errors.coures && <p className='error-msg'>{errors.coures.message}</p>}
          </div>

          {errors.root && <p className='error-msg'>{errors.root.message}</p>}
         <input 
          type="submit" 
          value={isSubmitting ? 'Submitting...' : 'Submit'} 
          disabled={isSubmitting} 
        />

        </form>
      </div>
      <div className="result" id='result'>
        <h1>Suggested Colleges for You</h1>
        {clgList.length !== 0 ? 
        <table className="clg-list">
          <tr className='clg-return-list'>

            <td className='tdl'>College code</td>
            <td className='tdr'>College name</td>

          </tr>
          {
            clgList && clgList.map((val) => (
              <tr className='clg-return-list' key={val.code}>

                <td className='clg-code'>{val.code}</td>
                <td className='clg-code'>{val.name}</td>

              </tr>
            ))
          }
        </table> : <p className='alrt-mgs'>{resultState}</p>}
      </div>
      <footer class="footer">
        &copy;Engineering Counselling Prediction
      </footer>

    </div>
  );
}

export default App;