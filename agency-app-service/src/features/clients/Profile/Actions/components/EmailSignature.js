import { useSelector } from 'react-redux';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import logo from 'assets/logos/square-logo.png';

const EmailSignature = () => {
  const { firstName, lastName, email, role } = useSelector(
    selectAuthenticatedUser
  );

  return `
  <!-- signature -->
  <div
  style="
    min-width: 600px;
    width: 100%;
    border: 1px solid #fff;
    margin-top: 10px;
  "
>
  <table
    style="font: 90% Arial; font-size: initial; color: #4f81a2"
  >
    <tbody>
      <tr>
        <td valign="top">
          <table
            style="font: 90% Arial; color: #4f81a2"
          >
            <tbody>
              <tr>
                <td
                  style="font: 90% Arial; padding: 0 0 8px 0"
                >
                  <span style="color: #4f81a2; font-size: 1.5em">${firstName} ${lastName}
                  <span style="color: #4f81a2; font-size: 0.9em; text-transform: capitalize;">- ${role.name}
                </td>
              </tr>
            </tbody>
          </table>
          <table
            style="font: 90% Arial; color: #4f81a2"
          >
            <tbody>
              <tr>
                <td
                  valign="top"
                  style="font: 90% Arial; padding: 0 5px 0 0"
                >
                  <div>
                    <span
                      style="font-size: 16px; line-height: 16px"
                    >
                      <img
                        src="https://img.newoldstamp.com/t/8/p.png"
                        style="display: inline-block; vertical-align: middle"
                      />
                    <span
                      style="color: #4f81a2; font-size: 1em"
                      >800-820-3746
                    <div
                      style="line-height: 6px; font-size: 6px"
                    >
                      <br />
                    </div>
                  </div>
                  <div>
                    <span
                      style="font-size: 16px; line-height: 16px"
                    >
                      <img
                        src="https://img.newoldstamp.com/t/8/m.png"
                        style="display: inline-block; vertical-align: middle"
                      />
                    <span
                      style="color: #4f81a2; font-size: 1em"
                      >null
                    <div
                      style="line-height: 6px; font-size: 6px"
                    >
                      <br />
                    </div>
                  </div>
                </td>
                <td
                  valign="top"
                  style="font: 90% Arial; padding: 0 0 0 0"
                >
                  <div>
                    <span
                      style="font-size: 1em"
                      >│
                    <span
                      style="font-size: 16px; line-height: 16px"
                    >
                      <img
                        src="https://img.newoldstamp.com/t/8/w.png"
                        style="display: inline-block; vertical-align: middle"
                      />
                    <a
                      href="https://img.newoldstamp.com/r/308389/w"
                      target="_blank"
                      style="
                        color: #4f81a2;
                        font-size: 1em;
                        text-decoration: none;
                      "
                      rel="noopener"
                      >agency.betterseller.com
                    <div
                      style="line-height: 6px; font-size: 6px"
                    >
                      <br />
                    </div>
                  </div>
                  <div>
                    <span
                      style="font-size: 1em"
                      >│
                    <span
                      style="font-size: 16px; line-height: 16px"
                    >
                      <img
                        src="https://img.newoldstamp.com/t/8/e.png"
                        style="display: inline-block; vertical-align: middle"
                      />
                    <a
                      href="${email}"
                      target="_blank"
                      style="
                        color: #4f81a2;
                        font-size: 1em;
                        text-decoration: none;
                      "
                      rel="noopener"
                      >${email}
                    <div
                      style="line-height: 6px; font-size: 6px"
                    >
                      <br />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  style="font: 90% Arial"
                  colspan="2"
                >
                  <div>
                    <span
                      style="font-size: 16px; line-height: 16px"
                    >
                      <img
                        src="https://img.newoldstamp.com/t/8/a.png"
                        style="display: inline-block; vertical-align: middle"
                      />
                    <span
                      style="color: #4f81a2; font-size: 1em"
                      >2-7676 Woodbine Ave, Markham, ON, L3R 2N2, Canada
                    <div
                      style="line-height: 6px; font-size: 6px"
                    >
                      <br />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="
                    font: 90% Arial;
                    padding: 3px 0 0 0;
                    border-top: 2px solid;
                  "
                >
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <a
                            style="vertical-align: top"
                            href="https://img.newoldstamp.com/r/308389/instagram"
                            target="_blank"
                            rel="noopener"
                            ><img
                              style=""
                              src="https://img.newoldstamp.com/i/0/0/0/0/98.png?cRc0Q"
                              width="24"
                              alt="instagram"
                          /></a>
                        </td>
                        <td>
                          <a
                            style="vertical-align: top"
                            href="https://img.newoldstamp.com/r/308389/youtube"
                            target="_blank"
                            rel="noopener"
                            ><img
                              style=""
                              src="https://img.newoldstamp.com/i/0/0/0/0/224.png?WFWlF"
                              width="24"
                              alt="youtube"
                          /></a>
                        </td>
                        <td>
                          <a
                            style="vertical-align: top"
                            href="https://img.newoldstamp.com/r/308389/linkedin"
                            target="_blank"
                            rel="noopener"
                            ><img
                              style=""
                              src="https://img.newoldstamp.com/i/0/0/0/0/106.png?HMCZu"
                              width="24"
                              alt="linkedin"
                          /></a>
                        </td>
                        <td>
                          <a
                            style="vertical-align: top"
                            href="https://img.newoldstamp.com/r/308389/facebook"
                            target="_blank"
                            rel="noopener"
                            ><img
                              style=""
                              src="https://img.newoldstamp.com/i/0/0/0/0/55.png?ZvEVX"
                              width="24"
                              alt="facebook"
                          /></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  <table>
    <tbody>
      <tr>
        <td
          style="font-size: 1px; line-height: 1px"
        >
          <img
              src="https://ci5.googleusercontent.com/proxy/c5LTZwiKBHC54EJkVIgMFggVcAxcGJLlEBYvTDFPT0tAL1pGCBy1XD-bGOGZ5kHnt7dapucawNLuc0MqxOdIJndaEE1L8CvgOANRDBcztYdh2gZF1iTcvlJ0GIZHx9jvPfdEH6BFbte53a36EiB40XqVY7XpEBCUdN7CdmqjUPha-Mi2Hw=s0-d-e1-ft#https://ryjujc.stripocdn.email/content/guids/CABINET_dc703e1fea8ae2fc7f4b80faf4ea6499/images/42971629276708636.png"
              width="145"
              style="vertical-align: middle; border: 0"
              alt="Workflow"
            />
        </td>
      </tr>
    </tbody>
  </table>
</div>
  `;
};

export default EmailSignature;
