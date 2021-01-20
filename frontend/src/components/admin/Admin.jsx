import React from "react";
import { withAdminAuth } from "../../util/auth";

const Admin =  function() {
    return (
        <div AdminPage>
            <h1> Blacklist Users </h1>
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input
                  autoFocus
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      );
};

export default withAdminAuth(Admin);
