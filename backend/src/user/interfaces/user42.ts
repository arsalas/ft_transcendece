export interface IUser42 {
	achievements:      Achievement[];
	"active?":         boolean;
	"alumni?":         boolean;
	alumnized_at:      null;
	anonymize_date:    Date;
	campus:            Campus[];
	campus_users:      CampusUser[];
	correction_point:  number;
	created_at:        Date;
	cursus_users:      CursusUser[];
	data_erasure_date: Date;
	displayname:       string;
	email:             string;
	expertises_users:  ExpertisesUser[];
	first_name:        string;
	groups:            any[];
	id:                number;
	image:             Image;
	kind:              string;
	languages_users:   LanguagesUser[];
	last_name:         string;
	location:          null;
	login:             string;
	partnerships:      any[];
	patroned:          any[];
	patroning:         Patroning[];
	phone:             string;
	pool_month:        string;
	pool_year:         string;
	projects_users:    ProjectsUser[];
	roles:             any[];
	"staff?":          boolean;
	titles:            Title[];
	titles_users:      TitlesUser[];
	updated_at:        Date;
	url:               string;
	usual_first_name:  null;
	usual_full_name:   string;
	wallet:            number;
   }
   
interface Achievement {
	description:    string;
	id:             number;
	image:          string;
	kind:           Kind;
	name:           string;
	nbr_of_success: number | null;
	tier:           Tier;
	users_url:      string;
	visible:        boolean;
}
   
 enum Kind {
	Pedagogy = "pedagogy",
	Project = "project",
	Scolarity = "scolarity",
	Social = "social",
}
   
enum Tier {
	Challenge = "challenge",
	Easy = "easy",
	Hard = "hard",
	Medium = "medium",
	None = "none",
}
   
interface Campus {
	active:               boolean;
	address:              string;
	city:                 string;
	country:              string;
	default_hidden_phone: boolean;
	email_extension:      string;
	facebook:             string;
	id:                   number;
	language:             Language;
	name:                 string;
	public:               boolean;
	time_zone:            string;
	twitter:              string;
	users_count:          number;
	vogsphere_id:         number;
	website:              string;
	zip:                  string;
}
   
interface Language {
	created_at: Date;
	id:         number;
	identifier: string;
	name:       string;
	updated_at: Date;
}
   
interface CampusUser {
	campus_id:  number;
	created_at: Date;
	id:         number;
	is_primary: boolean;
	updated_at: Date;
	user_id:    number;
}
   
interface CursusUser {
	begin_at:      Date;
	blackholed_at: null;
	created_at:    Date;
	cursus:        Cursus;
	cursus_id:     number;
	end_at:        Date | null;
	grade:         null | string;
	has_coalition: boolean;
	id:            number;
	level:         number;
	skills:        Skill[];
	updated_at:    Date;
	user:          User;
}
   
interface Cursus {
	created_at: Date;
	id:         number;
	kind:       string;
	name:       string;
	slug:       string;
}
   
interface Skill {
	id:    number;
	level: number;
	name:  string;
}
   
interface User {
	"active?":         boolean;
	"alumni?":         boolean;
	alumnized_at:      null;
	anonymize_date:    Date;
	correction_point:  number;
	created_at:        Date;
	data_erasure_date: Date;
	displayname:       string;
	email:             string;
	first_name:        string;
	id:                number;
	image:             Image;
	kind:              string;
	last_name:         string;
	location:          null;
	login:             string;
	phone:             string;
	pool_month:        string;
	pool_year:         string;
	"staff?":          boolean;
	updated_at:        Date;
	url:               string;
	usual_first_name:  null;
	usual_full_name:   string;
	wallet:            number;
}
   
interface Image {
	link:     string;
	versions: Versions;
}
   
interface Versions {
	large:  string;
	medium: string;
	micro:  string;
	small:  string;
}
   
   interface ExpertisesUser {
	contact_me:   boolean;
	created_at:   Date;
	expertise_id: number;
	id:           number;
	interested:   boolean;
	user_id:      number;
	value:        number;
}
   
interface LanguagesUser {
	created_at:  Date;
	id:          number;
	language_id: number;
	position:    number;
	user_id:     number;
}
   
interface Patroning {
	created_at:   Date;
	godfather_id: number;
	id:           number;
	ongoing:      boolean;
	updated_at:   Date;
	user_id:      number;
}
   
interface ProjectsUser {
	created_at:      Date;
	current_team_id: number | null;
	cursus_ids:      number[];
	final_mark:      number | null;
	id:              number;
	marked:          boolean;
	marked_at:       Date | null;
	occurrence:      number;
	project:         Project;
	retriable_at:    Date | null;
	status:          Status;
	updated_at:      Date;
	"validated?":    boolean | null;
}
   
interface Project {
	id:        number;
	name:      string;
	parent_id: null;
	slug:      string;
}
   
enum Status {
	Finished = "finished",
	SearchingAGroup = "searching_a_group",
}
   
interface Title {
	id:   number;
	name: string;
}
   
interface TitlesUser {
	created_at: Date;
	id:         number;
	selected:   boolean;
	title_id:   number;
	updated_at: Date;
	user_id:    number;
}
   