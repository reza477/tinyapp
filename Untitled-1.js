const bodyUrlEncoded = "longURL=changed.com&otherValue=whatever"

const pairs = bodyUrlEncoded.split("&")
const body = {};

for(let p of pairs) {
  const keyvalue = p.split("=")
  const key = keyvalue[0];
  const value = keyvalue[1];
  body[key] = value;
}



{
  longURL: "changed.com",
  otherValue: "whatever"
}