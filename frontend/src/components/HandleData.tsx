import { SocialNetwork, UserHandle } from "../types";

type HandleDataPros = {
  data: UserHandle;
};
export const HandleData = ({ data }: HandleDataPros) => {
  const links: SocialNetwork[] = JSON.parse(data.links).filter(
    (link: SocialNetwork) => link.enabled
  );
  console.log();
  return (
    <div className="space-y-6 text-white">
      <p className="text-5xl text-center font-black">{data.handle}</p>
      {data.image && <img src={data.image} className="max-w-[250] mx-auto" />}
      <p className="text-lg text-center font-bold">{data.description}</p>
      <div className="mt-20 flex flex-col gap-6">
        {links.length ? (
          links.map((link) => (
            <a
              key={link.name}
              className="bg-white px-5 py-2 flex items-center gap-5 rounded-lg"
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={`/social/icon_${link.name}.svg`} className="w-12" alt="Image red social" />
              <p className="text-black capitalize font-bold text-lg"> Visita mi: {link.name}</p>
            </a>
          ))
        ) : (
          <p className="text-center ">No hay enlaces en este perfil</p>
        )}
      </div>
    </div>
  );
};
